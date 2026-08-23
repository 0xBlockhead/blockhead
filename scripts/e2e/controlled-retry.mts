import { createHash } from 'node:crypto'
import { appendFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { basename, join, resolve } from 'node:path'
import { execFile, spawn, type ChildProcess } from 'node:child_process'
import { promisify } from 'node:util'

import {
	canonicalJson,
	corpusFingerprint,
	createRouteRunIdentity,
	resultSetFingerprint,
	routeCorpusTargetsFromPathnames,
	type RouteRunIdentity,
} from './routeRunIdentity.ts'

const execFileAsync = promisify(execFile)
const sha256 = (value: string | Uint8Array) => createHash('sha256').update(value).digest('hex')
export const controlledRetrySchemaVersion = 4

export type ControlledRetryManifest = {
	schemaVersion: number
	ids: string[]
	paths: string[]
	commit: string
	dirtyPatchHash: string | null
	workers: number
	freshContextPerAttempt: boolean
	attempts: number
	runnerSha256: string | null
	server: {
		url: string
		buildIdentity: string
		command?: {
			executable: string
			arguments: string[]
		}
	}
	corpusVersion: string
	classifierVersion: string
}

type Artifact = { path: string, sha256: string }
export type ControlledRetryAttempt = {
	schemaVersion: typeof controlledRetrySchemaVersion
	runId: string
	pathname: string
	attempt: number
	contextId: string
	terminal: true
	outcome: 'captured' | 'failed'
	detail: string
	startedAt: string
	endedAt: string
	runIdentity: RouteRunIdentity
	artifacts: { screenshot: Artifact | null, trace: Artifact | null, diagnostics: Artifact }
	toolInputHash: string
	toolOutputHash: string
}

export type ControlledRetryRun = {
	schemaVersion: typeof controlledRetrySchemaVersion
	runId: string
	status: 'completed' | 'incomplete'
	product: { commit: string, dirtyPatchHash: string | null }
	tools: { runner: string, runnerSha256: string, browser: string }
	inputs: { manifest: ControlledRetryManifest, manifestSha256: string }
	runIdentity: RouteRunIdentity
	outputs: {
		attempts: string
		artifactsDirectory: string
		corpusFingerprint: string
		resultSetFingerprint: string
	}
	counts: { completedAttempts: number, expectedAttempts: number, clean: number, failures: number }
	validations: { name: string, passed: boolean }[]
	startedAt: string
	endedAt: string
}

export type CaptureContext = {
	id: string
	startTracing: () => Promise<void>
	newPage: () => Promise<{ goto: (url: string) => Promise<void>, screenshot: (options: { path: string, fullPage: boolean }) => Promise<void>, content: () => Promise<string>, url: () => string, isMainVisible: () => Promise<boolean>, waitForTimeout: (milliseconds: number) => Promise<void>, close: () => Promise<void> }>
	stopTracing: (path: string) => Promise<void>
	close: () => Promise<void>
}

export type CaptureBrowser = { newContext: () => Promise<CaptureContext>, close: () => Promise<void>, identity: string }

type CapturePage = Awaited<ReturnType<CaptureContext['newPage']>>

export const adaptCapturePage = (page: {
	goto: CapturePage['goto']
	screenshot: CapturePage['screenshot']
	content: CapturePage['content']
	url: CapturePage['url']
	locator: (selector: string) => { isVisible: () => Promise<boolean> }
	waitForTimeout: CapturePage['waitForTimeout']
	close: CapturePage['close']
}): CapturePage => ({
	goto: (url) => page.goto(url),
	screenshot: (options) => page.screenshot(options),
	content: () => page.content(),
	url: () => page.url(),
	isMainVisible: () => page.locator('#main').isVisible(),
	waitForTimeout: (milliseconds) => page.waitForTimeout(milliseconds),
	close: () => page.close(),
})

const captureSettleTimeoutMs = 120_000
const captureQuietMs = 2_000

const renderedMainState = (html: string) => {
	const main = html.match(/<main\b[^>]*\bid=["']main["'][^>]*>([\s\S]*?)<\/main>/i)
	if (main == null)
		return { ready: false, reason: 'no-#main' }
	const text = main[1].replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim()
	if (text.length === 0)
		return { ready: false, reason: '#main-empty' }
	if (/\baria-busy=["']true["']|\bdata-loading\b/i.test(main[0]))
		return { ready: false, reason: '#main-still-loading' }
	if (/\bdata-error\b/i.test(main[0]))
		return { ready: false, reason: '#main-boundary-error' }
	return { ready: true, reason: `#main-text-length=${text.length}` }
}

export const waitForCaptureQuality = async (page: CapturePage, pathname: string, {
	timeoutMs = captureSettleTimeoutMs,
	quietMs = captureQuietMs,
}: { timeoutMs?: number, quietMs?: number } = {}) => {
	const deadline = Date.now() + timeoutMs
	let lastHtml = ''
	let quietSince = Date.now()
	let lastReason = 'bootstrap-shell'
	while (Date.now() < deadline) {
		const html = await page.content()
		const state = renderedMainState(html)
		lastReason = state.reason
		if (state.ready && await page.isMainVisible()) {
			if (html === lastHtml) {
				if (Date.now() - quietSince >= quietMs) {
					const finalUrl = new URL(page.url())
					if (finalUrl.pathname !== pathname)
						throw new Error(`capture canonical route mismatch: expected ${pathname}, received ${finalUrl.pathname}`)
					return
				}
			}
			else {
				lastHtml = html
				quietSince = Date.now()
			}
		}
		else {
			if (state.ready)
				lastReason = '#main-not-visible'
			lastHtml = ''
			quietSince = Date.now()
		}
		await page.waitForTimeout(250)
	}
	throw new Error(`capture settlement timed out: ${lastReason}`)
}

const git = async (productRoot: string, ...args: string[]) => (
	(await execFileAsync('git', args, { cwd: productRoot })).stdout.trim()
)

export const productDirtyPatchHash = async (productRoot: string) => {
	const [diff, untracked] = await Promise.all([
		git(productRoot, 'diff', 'HEAD', '--binary', '--', '.'),
		git(productRoot, 'ls-files', '--others', '--exclude-standard', '-z'),
	])
	const untrackedFiles = await Promise.all(untracked.split('\u0000').filter(Boolean).sort().map(async (relativePath) => (
		`${relativePath}\u0000${sha256(await readFile(join(productRoot, relativePath)))}\n`
	)))
	return sha256(`${diff}\u0000${untrackedFiles.join('')}`)
}

export const assertManifest = (manifest: ControlledRetryManifest) => {
	if (manifest.schemaVersion !== controlledRetrySchemaVersion)
		throw new Error(`controlled retry manifest must use schema ${controlledRetrySchemaVersion}`)
	if (manifest.paths.length === 0 || manifest.attempts < 1)
		throw new Error('controlled retry manifest requires paths and attempts')
	if (new Set(manifest.paths).size !== manifest.paths.length || manifest.paths.some((pathname) => !pathname.startsWith('/')))
		throw new Error('controlled retry manifest has duplicate or non-absolute paths')
	if (manifest.workers !== 1 || !manifest.freshContextPerAttempt)
		throw new Error('controlled retry requires one worker and a fresh context per attempt')
	if (!manifest.server.url || !manifest.server.buildIdentity)
		throw new Error('controlled retry manifest requires a pinned server URL and build identity')
}

const artifact = async (path: string): Promise<Artifact> => ({ path, sha256: sha256(await readFile(path)) })
const attemptKey = (attempt: Pick<ControlledRetryAttempt, 'pathname' | 'attempt'>) => `${attempt.pathname}\u0000${attempt.attempt}`
const expectedKeys = (manifest: ControlledRetryManifest) => manifest.paths.flatMap((pathname) => (
	Array.from({ length: manifest.attempts }, (_, index) => `${pathname}\u0000${index + 1}`)
))

export const validateControlledRetryRun = ({ attempts, manifest, run }: {
	attempts: readonly ControlledRetryAttempt[]
	manifest: ControlledRetryManifest
	run: ControlledRetryRun
}) => {
	assertManifest(manifest)
	const expected = expectedKeys(manifest)
	const actual = attempts.map(attemptKey)
	if (actual.length !== expected.length || new Set(actual).size !== expected.length || expected.some((key) => !actual.includes(key)))
		throw new Error('controlled retry has hidden skips or mismatched attempt counts')
	if (new Set(attempts.map(({ contextId }) => contextId)).size !== attempts.length)
		throw new Error('controlled retry reused a browser context')
	if (attempts.some((attempt) => !attempt.terminal))
		throw new Error('controlled retry cannot complete with non-terminal attempts')
	if (run.status === 'completed' && run.counts.completedAttempts !== run.counts.expectedAttempts)
		throw new Error('controlled retry cannot report completed with partial attempts')
	if (run.status === 'completed' && run.counts.expectedAttempts !== expected.length)
		throw new Error('controlled retry completed count does not match manifest')
	for (const attempt of attempts) {
		if (attempt.runIdentity.commit !== run.runIdentity.commit || attempt.runIdentity.dirtyTreeFingerprint !== run.runIdentity.dirtyTreeFingerprint)
			throw new Error('controlled retry attempt omitted coherent run provenance')
		if (!attempt.artifacts.diagnostics.sha256 || (attempt.outcome === 'captured' && (attempt.artifacts.screenshot == null || attempt.artifacts.trace == null)))
			throw new Error('controlled retry attempt omitted capture artifacts')
	}
}

export const runControlledRetry = async ({ browser, manifest, outputDirectory, productRoot, runnerPath = new URL(import.meta.url).pathname }: {
	browser: CaptureBrowser
	manifest: ControlledRetryManifest
	outputDirectory: string
	productRoot: string
	runnerPath?: string
}): Promise<ControlledRetryRun> => {
	assertManifest(manifest)
	const [commit, actualDirtyPatchHash, runnerSha256] = await Promise.all([
		git(productRoot, 'rev-parse', 'HEAD'),
		productDirtyPatchHash(productRoot),
		readFile(runnerPath).then(sha256),
	])
	if (commit !== manifest.commit)
		throw new Error(`product commit mismatch: expected ${manifest.commit}, received ${commit}`)
	if (manifest.dirtyPatchHash === null ? actualDirtyPatchHash !== sha256('\u0000') : actualDirtyPatchHash !== manifest.dirtyPatchHash)
		throw new Error('product tree is dirty or does not match manifest dirtyPatchHash')
	if (manifest.runnerSha256 !== null && manifest.runnerSha256 !== runnerSha256)
		throw new Error('runner SHA256 does not match manifest')

	await mkdir(outputDirectory, { recursive: true })
	if ((await readdir(outputDirectory)).length > 0)
		throw new Error('controlled retry output directory must be empty')
	await Promise.all(['screenshots', 'traces', 'diagnostics'].map((directory) => mkdir(join(outputDirectory, directory), { recursive: true })))
	const startedAt = new Date().toISOString()
	const runIdentity = await createRouteRunIdentity({
		browserIdentity: browser.identity,
		buildIdentity: manifest.server.buildIdentity,
		captureContractVersion: `controlled-retry/${controlledRetrySchemaVersion}`,
		classifierVersion: manifest.classifierVersion,
		corpusVersion: manifest.corpusVersion,
		repositoryDirectory: productRoot,
	})
	const manifestSha256 = sha256(canonicalJson(manifest))
	const runId = `sha256:${sha256(`${manifestSha256}\u0000${runIdentity.commit}\u0000${runIdentity.dirtyTreeFingerprint}\u0000${runnerSha256}`)}`
	const attempts: ControlledRetryAttempt[] = []
	const attemptsPath = join(outputDirectory, 'attempts.jsonl')

	for (const pathname of manifest.paths) for (let attempt = 1; attempt <= manifest.attempts; attempt += 1) {
		const started = new Date().toISOString()
		const context = await browser.newContext()
		const stem = `${String(attempts.length + 1).padStart(2, '0')}-${attempt}`
		let screenshot: Artifact | null = null
		let trace: Artifact | null = null
		let detail = ''
		try {
			await context.startTracing()
			const page = await context.newPage()
			try {
				await page.goto(new URL(pathname, manifest.server.url).href)
				await waitForCaptureQuality(page, pathname)
				const screenshotPath = join(outputDirectory, 'screenshots', `${stem}.png`)
				await page.screenshot({ path: screenshotPath, fullPage: true })
				screenshot = await artifact(screenshotPath)
				const diagnosticPath = join(outputDirectory, 'diagnostics', `${stem}.html`)
				await writeFile(diagnosticPath, await page.content())
			} finally {
				await page.close()
			}
		} catch (error) {
			detail = error instanceof Error ? error.message : String(error)
		} finally {
			const tracePath = join(outputDirectory, 'traces', `${stem}.zip`)
			try { await context.stopTracing(tracePath); trace = await artifact(tracePath) } catch (error) { detail ||= error instanceof Error ? error.message : String(error) }
			await context.close()
		}
		const diagnosticPath = join(outputDirectory, 'diagnostics', `${stem}.html`)
		const diagnostics = await artifact(diagnosticPath).catch(async () => {
			await writeFile(diagnosticPath, detail)
			return artifact(diagnosticPath)
		})
		const record = {
			schemaVersion: controlledRetrySchemaVersion,
			runId,
			pathname,
			attempt,
			contextId: context.id,
			terminal: true,
			outcome: detail ? 'failed' : 'captured',
			detail,
			startedAt: started,
			endedAt: new Date().toISOString(),
			runIdentity,
			artifacts: { screenshot, trace, diagnostics },
			toolInputHash: manifestSha256,
		} as const
		const completed = { ...record, toolOutputHash: sha256(canonicalJson(record)) } satisfies ControlledRetryAttempt
		attempts.push(completed)
		await appendFile(attemptsPath, `${JSON.stringify(completed)}\n`)
	}
	await browser.close()
	const run = {
		schemaVersion: controlledRetrySchemaVersion,
		runId,
		status: 'completed',
		product: { commit, dirtyPatchHash: manifest.dirtyPatchHash },
		tools: { runner: basename(runnerPath), runnerSha256, browser: browser.identity },
		inputs: { manifest, manifestSha256 },
		runIdentity,
		outputs: {
			attempts: attemptsPath,
			artifactsDirectory: outputDirectory,
			corpusFingerprint: corpusFingerprint(routeCorpusTargetsFromPathnames(manifest.paths)),
			resultSetFingerprint: resultSetFingerprint(attempts.map((attempt) => ({
				targetId: attempt.pathname,
				exampleId: String(attempt.attempt),
				exampleVersion: attempt.toolOutputHash,
				outcome: attempt.outcome,
			}))),
		},
		counts: { completedAttempts: attempts.length, expectedAttempts: expectedKeys(manifest).length, clean: attempts.filter(({ outcome }) => outcome === 'captured').length, failures: attempts.filter(({ outcome }) => outcome === 'failed').length },
		validations: [
			{ name: 'attempt-and-run-schema', passed: true },
			{ name: 'product-tool-input-output-hashes', passed: true },
			{ name: 'attempt-count-and-fresh-context', passed: true },
		],
		startedAt,
		endedAt: new Date().toISOString(),
	} satisfies ControlledRetryRun
	validateControlledRetryRun({ attempts, manifest, run })
	await writeFile(join(outputDirectory, 'capture-run.json'), `${JSON.stringify(run, null, '\t')}\n`)
	await appendFile(join(outputDirectory, 'capture-history.jsonl'), `${JSON.stringify(run)}\n`)
	return run
}

const parseManifest = async (path: string): Promise<ControlledRetryManifest> => {
	const manifest: ControlledRetryManifest = JSON.parse(await readFile(path, 'utf8'))
	return manifest
}
const argument = (name: string) => {
	const index = process.argv.indexOf(name)
	return index === -1 ? undefined : process.argv[index + 1]
}

const startPinnedServer = async (manifest: ControlledRetryManifest, productRoot: string): Promise<ChildProcess | null> => {
	if (manifest.server.command == null)
		return null
	const server = spawn(
		manifest.server.command.executable,
		manifest.server.command.arguments,
		{ cwd: productRoot, stdio: 'inherit' }
	)
	const deadline = Date.now() + 60_000
	while (Date.now() < deadline) {
		try {
			const response = await fetch(manifest.server.url)
			if (response.ok)
				return server
		} catch {}
		await new Promise((resolve) => setTimeout(resolve, 250))
	}
	server.kill('SIGTERM')
	throw new Error(`pinned product server did not become ready: ${manifest.server.url}`)
}

const stopPinnedServer = async (server: ChildProcess | null) => {
	if (server == null || server.exitCode !== null)
		return
	server.kill('SIGTERM')
	await Promise.race([
		new Promise<void>((resolveExit) => server.once('exit', () => resolveExit())),
		new Promise<void>((resolveTimeout) => setTimeout(resolveTimeout, 5_000)),
	])
	if (server.exitCode === null)
		server.kill('SIGKILL')
}

if (process.argv[1]?.endsWith('controlled-retry.mts')) {
	const manifestPath = argument('--manifest')
	const outputDirectory = argument('--output-dir')
	const productRoot = argument('--product-root')
	if (!manifestPath || !outputDirectory || !productRoot)
		throw new Error('usage: controlled-retry.mts --manifest FILE --output-dir DIRECTORY --product-root DIRECTORY')
	const manifest = await parseManifest(resolve(manifestPath))
	const { chromium } = await import('playwright')
	const resolvedProductRoot = resolve(productRoot)
	const server = await startPinnedServer(manifest, resolvedProductRoot)
	try {
		const browser = await chromium.launch({ headless: true })
		await runControlledRetry({
			browser: {
				identity: `playwright chromium ${browser.version()}`,
				newContext: async () => {
					const context = await browser.newContext()
					return {
						id: crypto.randomUUID(),
						startTracing: () => context.tracing.start({ screenshots: true, snapshots: true, sources: true }),
						newPage: async () => adaptCapturePage(await context.newPage()),
						stopTracing: (path) => context.tracing.stop({ path }),
						close: () => context.close(),
					}
				},
				close: () => browser.close(),
			},
			manifest,
			outputDirectory: resolve(outputDirectory),
			productRoot: resolvedProductRoot,
		})
	} finally {
		await stopPinnedServer(server)
	}
}
