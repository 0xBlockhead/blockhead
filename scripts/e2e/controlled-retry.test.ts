import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import {
	controlledRetrySchemaVersion,
	assertManifest,
	productDirtyPatchHash,
	runControlledRetry,
	validateControlledRetryRun,
	waitForCaptureQuality,
	adaptCapturePage,
	type CaptureBrowser,
	type ControlledRetryManifest,
	type ControlledRetryRuntimeDiagnostics,
} from './controlled-retry.mts'
import { waitForBoundarySettlement } from './boundarySettlement.ts'
import { acquireExclusiveWriterLock } from './routeRunIdentity.ts'

const manifest = (commit: string): ControlledRetryManifest => ({
	schemaVersion: controlledRetrySchemaVersion,
	ids: ['gap-a'],
	paths: ['/a', '/b'],
	commit,
	dirtyPatchHash: null,
	workers: 1,
	freshContextPerAttempt: true,
	attempts: 2,
	runnerSha256: null,
	server: { url: 'http://127.0.0.1:4173/', buildIdentity: 'fixture-build' },
	corpusVersion: 'fixture-corpus',
	classifierVersion: 'fixture-classifier',
})

test('settlement yields when a fixture wait resolves immediately', async () => {
	let snapshots = 0
	const result = await waitForBoundarySettlement({
		snapshot: async () => ({ loading: 0, failed: 0, empty: false, reason: 'ready', snapshots: ++snapshots }),
		events: async () => 0,
		wait: async () => {},
	}, { timeoutMs: 250, quietMs: 10 })
	assert.equal(result.settled, true)
	assert.ok(snapshots < 100)
})

const cleanRuntimeDiagnostics = (): ControlledRetryRuntimeDiagnostics => ({
	console: [],
	pageErrors: [],
	requestFailures: [],
	main: {
		boundaryEvents: [],
		contentHeight: 900,
		mainText: 'fixture',
		overflow: { carouselX: 0, pageX: 0, pageY: 0 },
		settled: { empty: false, failed: [], loading: [] },
		finalUrl: 'http://127.0.0.1:4173/a',
		readyState: 'complete',
		visible: true,
		textLength: 7,
		contentMarkerCount: 1,
	},
})

const browser = (runtimeDiagnostics = cleanRuntimeDiagnostics()): CaptureBrowser => {
	let contexts = 0
	return {
		identity: 'fixture chromium 1',
		newContext: async () => {
			contexts += 1
			let currentUrl = 'http://127.0.0.1:4173/'
			return {
				id: `context-${contexts}`,
				startTracing: async () => {},
				newPage: async () => ({
					goto: async (url) => { currentUrl = url },
					screenshot: async ({ path }) => writeFile(path, 'image'),
					content: async () => '<main id="main">fixture</main>',
					url: () => currentUrl,
					isMainVisible: async () => true,
					runtimeDiagnostics: async () => ({
						...runtimeDiagnostics,
						main: { ...runtimeDiagnostics.main, finalUrl: currentUrl },
					}),
					waitForTimeout: async () => {},
					close: async () => {},
				}),
				stopTracing: async (path) => writeFile(path, 'trace'),
				close: async () => {},
			}
		},
		close: async () => {},
	}
}

test('captures every manifest attempt with complete route run provenance', async () => {
	const productRoot = process.cwd()
	const commit = (await (await import('node:child_process')).execFileSync('git', ['rev-parse', 'HEAD'], { cwd: productRoot })).toString().trim()
	const outputDirectory = await mkdtemp(join(tmpdir(), 'controlled-retry-'))
	const input = { ...manifest(commit), dirtyPatchHash: await productDirtyPatchHash(productRoot) }
	const run = await runControlledRetry({ browser: browser(), manifest: input, outputDirectory, productRoot, runnerPath: new URL(import.meta.url).pathname })
	assert.equal(run.status, 'completed')
	assert.equal(run.counts.completedAttempts, 4)
	assert.equal((await readFile(join(outputDirectory, 'attempts.jsonl'), 'utf8')).trim().split('\n').length, 4)
	assert.match(run.runIdentity.browserIdentity, /fixture chromium/)
	assert.equal(run.runIdentity.buildIdentity, 'fixture-build')
	assert.match(run.outputs.corpusFingerprint, /^[0-9a-f]{64}$/)
	assert.match(run.outputs.resultSetFingerprint, /^[0-9a-f]{64}$/)
})

test('failed retry releases its writer lock for an immediate retry', async () => {
	const productRoot = process.cwd()
	const commit = (await (await import('node:child_process')).execFileSync('git', ['rev-parse', 'HEAD'], { cwd: productRoot })).toString().trim()
	const outputDirectory = await mkdtemp(join(tmpdir(), 'controlled-retry-failure-'))
	await writeFile(join(outputDirectory, 'preexisting.txt'), 'busy')
	const input = { ...manifest(commit), dirtyPatchHash: await productDirtyPatchHash(productRoot) }
	await assert.rejects(runControlledRetry({ browser: browser(), manifest: input, outputDirectory, productRoot, runnerPath: new URL(import.meta.url).pathname }), /output directory must be empty/)
	const release = await acquireExclusiveWriterLock(outputDirectory)
	await release()
})

test('classifies clean attempts and persists deterministic runtime diagnostics', async () => {
	const productRoot = process.cwd()
	const commit = (await (await import('node:child_process')).execFileSync('git', ['rev-parse', 'HEAD'], { cwd: productRoot })).toString().trim()
	const outputDirectory = await mkdtemp(join(tmpdir(), 'controlled-retry-'))
	const input = { ...manifest(commit), paths: ['/a'], attempts: 1, dirtyPatchHash: await productDirtyPatchHash(productRoot) }
	const run = await runControlledRetry({ browser: browser(), manifest: input, outputDirectory, productRoot, runnerPath: new URL(import.meta.url).pathname })
	const attempt = JSON.parse((await readFile(join(outputDirectory, 'attempts.jsonl'), 'utf8')).trim())
	assert.equal(run.counts.clean, 1)
	assert.deepEqual(attempt.classification, { failures: [], warnings: [] })
	assert.deepEqual(attempt.runtimeDiagnostics.console, [])
	assert.deepEqual(attempt.runtimeDiagnostics.pageErrors, [])
	assert.deepEqual(attempt.runtimeDiagnostics.requestFailures, [])
	assert.equal(attempt.runtimeDiagnostics.main.settled.empty, false)
})

test('records runtime faults and makes classifier failures non-clean without losing capture artifacts', async () => {
	const productRoot = process.cwd()
	const commit = (await (await import('node:child_process')).execFileSync('git', ['rev-parse', 'HEAD'], { cwd: productRoot })).toString().trim()
	const outputDirectory = await mkdtemp(join(tmpdir(), 'controlled-retry-'))
	const input = { ...manifest(commit), paths: ['/a'], attempts: 1, dirtyPatchHash: await productDirtyPatchHash(productRoot) }
	const runtimeDiagnostics = cleanRuntimeDiagnostics()
	runtimeDiagnostics.console.push({ type: 'error', text: 'provider failed' })
	runtimeDiagnostics.pageErrors.push({ message: 'uncaught failure', stack: 'stack' })
	runtimeDiagnostics.requestFailures.push({ url: 'https://provider.test/data', method: 'GET', failure: 'net::ERR_FAILED', resourceType: 'fetch' })
	runtimeDiagnostics.main = {
		...runtimeDiagnostics.main,
		boundaryEvents: [{ kind: 'dom-failed' }],
		contentHeight: 100,
		mainText: 'No records received.',
		overflow: { carouselX: 3, pageX: 1, pageY: 2 },
		settled: { empty: true, failed: [{}], loading: [{}] },
	}
	const run = await runControlledRetry({ browser: browser(runtimeDiagnostics), manifest: input, outputDirectory, productRoot, runnerPath: new URL(import.meta.url).pathname })
	const attempt = JSON.parse((await readFile(join(outputDirectory, 'attempts.jsonl'), 'utf8')).trim())
	assert.equal(run.counts.failures, 1)
	assert.match(attempt.detail, /screenshot quality:/)
	assert.equal(attempt.runtimeDiagnostics.requestFailures[0].failure, 'net::ERR_FAILED')
	assert.ok(attempt.classification.failures.includes('boundary events: dom-failed, console-failed, console-uncaught'))
	assert.ok(attempt.classification.failures.includes('capture overflow: pageX=1, pageY=2, carouselX=3'))
	assert.ok(attempt.artifacts.screenshot)
	assert.ok(attempt.artifacts.trace)
})

test('bootstrap-only runtime cannot complete as captured', async () => {
	const bootstrapHtml = '<!DOCTYPE html><html lang="en"><head>\n\t\t<meta charset="utf-8">\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1">\n\t\t\n\t</head>\n\t<body data-sveltekit-preload-data="hover">\n\t\t<div style="display: contents">\n\t\t\t<script>\n\t\t\t\t{\n\t\t\t\t\t__sveltekit_dev = {\n\t\t\t\t\t\tbase: new URL("../../../..", location).pathname.slice(0, -1),\n\t\t\t\t\t\tenv: {}\n\t\t\t\t\t};\n\n\t\t\t\t\tconst element = document.currentScript.parentElement;\n\n\t\t\t\t\tPromise.all([\n\t\t\t\t\t\timport("/node_modules/.pnpm/@sveltejs+kit@2.70.2_@sveltejs+vite-plugin-svelte@7.2.0_svelte@5.56.8_vite@8.2.0_@types_681cb7889114275696b99222ec402ce9/node_modules/@sveltejs/kit/src/runtime/client/entry.js"),\n\t\t\t\t\t\timport("/@fs/Users/sample/Developer/blockhead-2026-agent/consolidated-20260821/acceptance-live/.svelte-kit/generated/client/app.js")\n\t\t\t\t\t]).then(([kit, app]) => {\n\t\t\t\t\t\tkit.start(app, element);\n\t\t\t\t\t});\n\t\t\t\t}\n\t\t\t</script>\n\t\t</div>\n\t\n\n</body></html>'
	assert.equal(Buffer.byteLength(bootstrapHtml), 905)
	const page = {
		content: async () => bootstrapHtml,
		url: () => 'http://127.0.0.1:4173/a',
		runtimeDiagnostics: async () => ({
			...cleanRuntimeDiagnostics(),
			main: { ...cleanRuntimeDiagnostics().main, readyState: 'complete', visible: false },
		}),
		waitForTimeout: async () => {},
	}
	await assert.rejects(
		waitForCaptureQuality(page, '/a', { timeoutMs: 1, quietMs: 0 }),
		/capture settlement timed out: no-visible-#main/
	)
})

test('capture page adapter preserves prototype-backed Playwright methods', async () => {
	class FakePage {
		async goto() {}
		async screenshot() {}
		async content() { return '<main id="main">fixture</main>' }
		url() { return 'http://127.0.0.1:4173/a' }
		locator() { return { isVisible: async () => true } }
		async evaluate(_pageFunction: () => ControlledRetryRuntimeDiagnostics['main']): Promise<ControlledRetryRuntimeDiagnostics['main']> {
			return {
				boundaryEvents: [], contentHeight: 900, mainText: 'fixture',
				overflow: { carouselX: 0, pageX: 0, pageY: 0 },
				settled: { empty: false, failed: [], loading: [] }, finalUrl: this.url(),
				readyState: 'complete', visible: true, textLength: 7, contentMarkerCount: 1,
			}
		}
		on() {}
		async waitForTimeout() {}
		async close() {}
	}
	const page = adaptCapturePage(new FakePage())
	await page.goto('/a')
	assert.equal(await page.content(), '<main id="main">fixture</main>')
	assert.equal(await page.isMainVisible(), true)
	assert.equal((await page.runtimeDiagnostics()).main.finalUrl, 'http://127.0.0.1:4173/a')
})

test('contract rejects omitted provenance, mismatched counts, reused contexts, and partial completion', async () => {
	const productRoot = process.cwd()
	const commit = (await (await import('node:child_process')).execFileSync('git', ['rev-parse', 'HEAD'], { cwd: productRoot })).toString().trim()
	const outputDirectory = await mkdtemp(join(tmpdir(), 'controlled-retry-'))
	const input = { ...manifest(commit), dirtyPatchHash: await productDirtyPatchHash(productRoot) }
	const run = await runControlledRetry({ browser: browser(), manifest: input, outputDirectory, productRoot, runnerPath: new URL(import.meta.url).pathname })
	const attempts = (await readFile(join(outputDirectory, 'attempts.jsonl'), 'utf8')).trim().split('\n').map((line) => JSON.parse(line))
	assert.throws(() => validateControlledRetryRun({ attempts: attempts.map((entry, index) => index === 0 ? { ...entry, runIdentity: { ...entry.runIdentity, commit: 'missing' } } : entry), manifest: input, run }), /omitted coherent run provenance/)
	assert.throws(() => validateControlledRetryRun({ attempts: attempts.slice(0, 3), manifest: input, run }), /hidden skips or mismatched attempt counts/)
	assert.throws(() => validateControlledRetryRun({ attempts: attempts.map((entry) => ({ ...entry, contextId: 'reused' })), manifest: input, run }), /reused a browser context/)
	assert.throws(() => validateControlledRetryRun({ attempts, manifest: input, run: { ...run, counts: { ...run.counts, completedAttempts: 3 } } }), /partial attempts/)
})

test('the historical 26-path evidence remains a reusable fixture rather than runner logic', async () => {
	const fixture = await readFile(join(process.cwd(), 'scripts/e2e/fixtures/controlled-retry-2026-08-21.manifest.json'), 'utf8')
	const historical = JSON.parse(fixture)
	assert.doesNotThrow(() => assertManifest(historical))
	assert.equal(historical.schemaVersion, controlledRetrySchemaVersion)
	assert.equal(historical.ids.length, 10)
	assert.equal(historical.paths.length, 26)
	assert.equal(historical.attempts, 2)
	assert.equal(historical.workers, 1)
	assert.equal(historical.freshContextPerAttempt, true)
	assert.deepEqual(historical.server.command, {
		executable: 'node',
		arguments: [
			'node_modules/vite/bin/vite.js',
			'dev',
			'--host',
			'127.0.0.1',
			'--port',
			'44763',
		],
	})
})
