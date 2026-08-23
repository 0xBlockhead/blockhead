import { createHash } from 'node:crypto'
import { lstat, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { basename, isAbsolute, join, relative, resolve } from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

import {
	assertManifest,
	controlledRetrySchemaVersion,
	productDirtyPatchHash,
	type ControlledRetryAttempt,
	type ControlledRetryManifest,
	type ControlledRetryRuntimeDiagnostics,
	type ControlledRetryRun,
} from './controlled-retry.mts'
import {
	canonicalJson,
	corpusFingerprint,
	createRouteRunIdentity,
	resultSetFingerprint,
	routeCorpusTargetsFromPathnames,
	type RouteRunIdentity,
} from './routeRunIdentity.ts'
import type { RouteScreenshotQuality } from '../../tests/_routeScreenshotQuality.ts'

const execFileAsync = promisify(execFile)
const sha256 = (value: string | Uint8Array) => createHash('sha256').update(value).digest('hex')
const hashPattern = /^[0-9a-f]{64}$/
const attemptsFileName = 'attempts.jsonl'
const captureRunFileName = 'capture-run.json'
const captureHistoryFileName = 'capture-history.jsonl'
const artifactDirectories = new Set(['screenshots', 'traces', 'diagnostics'])

export const controlledRetryInterruptionDisposition = 'interrupted-controlled-retry-prefix'

type HistoricalManifest = ControlledRetryManifest & {
	historicalRunnerSha256?: string
}

type TerminalizerAttempt = Omit<ControlledRetryAttempt, 'schemaVersion' | 'terminal' | 'runtimeDiagnostics' | 'classification' | 'artifacts'> & {
	schemaVersion: number
	terminal: boolean
	runtimeDiagnostics: ControlledRetryRuntimeDiagnostics | null
	classification: RouteScreenshotQuality | null
	artifacts: {
		screenshot: { path: string, sha256: string } | null
		trace: { path: string, sha256: string } | null
		diagnostics: { path: string, sha256: string } | null
	}
}

export type TerminalizedControlledRetryRun = Omit<ControlledRetryRun, 'tools'> & {
	tools: ControlledRetryRun['tools'] & {
		terminalizer: { path: string, sha256: string }
	}
	interruption: {
		disposition: typeof controlledRetryInterruptionDisposition
		observedKeys: string[]
		missingKeys: string[]
	}
}

const git = async (productRoot: string, ...args: string[]) => (
	(await execFileAsync('git', args, { cwd: productRoot, maxBuffer: 32 * 1024 * 1024 })).stdout.trim()
)

const attemptKey = (attempt: Pick<ControlledRetryAttempt, 'pathname' | 'attempt'>) => (
	`${attempt.pathname}\u0000${attempt.attempt}`
)

const expectedKeys = (manifest: ControlledRetryManifest) => manifest.paths.flatMap((pathname) => (
	Array.from({ length: manifest.attempts }, (_, index) => `${pathname}\u0000${index + 1}`)
))

const parseAttempts = (contents: string): TerminalizerAttempt[] => {
	const lines = contents.split('\n').map((line) => line.trim()).filter(Boolean)
	if (lines.length === 0)
		throw new Error('controlled retry cannot terminalize an empty attempts ledger')
	return lines.map((line, index) => {
		try {
			return JSON.parse(line)
		}
		catch (error) {
			throw new Error(`attempts.jsonl line ${index + 1} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`)
		}
	})
}

const assertHash = (value: string, name: string) => {
	if (!hashPattern.test(value))
		throw new Error(`${name} must be a lowercase SHA-256`)
}

const artifactPath = (outputDirectory: string, path: string) => {
	if (!isAbsolute(path))
		throw new Error(`artifact path is not absolute: ${path}`)
	const outputRoot = resolve(outputDirectory)
	const resolvedPath = resolve(path)
	if (relative(outputRoot, resolvedPath).startsWith('..'))
		throw new Error(`artifact path escapes output directory: ${path}`)
	return resolvedPath
}

const assertArtifact = async (outputDirectory: string, artifact: { path: string, sha256: string }, name: string) => {
	assertHash(artifact.sha256, `${name} SHA-256`)
	const path = artifactPath(outputDirectory, artifact.path)
	const stats = await lstat(path).catch(() => null)
	if (stats == null || !stats.isFile())
		throw new Error(`${name} artifact does not exist as a regular file: ${artifact.path}`)
	const actualHash = sha256(await readFile(path))
	if (actualHash !== artifact.sha256)
		throw new Error(`${name} artifact SHA-256 mismatch`)
}

const listFiles = async (directory: string): Promise<string[]> => {
	const entries = await readdir(directory, { withFileTypes: true })
	const files: string[] = []
	for (const entry of entries) {
		const path = join(directory, entry.name)
		if (entry.isDirectory())
			files.push(...await listFiles(path))
		else if (entry.isFile())
			files.push(path)
		else
			throw new Error(`output directory contains a non-regular entry: ${path}`)
	}
	return files
}

const assertOutputFiles = async (outputDirectory: string, attempts: readonly TerminalizerAttempt[]) => {
	const expected = new Set([join(outputDirectory, attemptsFileName)])
	for (const attempt of attempts) {
		for (const artifact of Object.values(attempt.artifacts))
			if (artifact != null)
				expected.add(artifactPath(outputDirectory, artifact.path))
	}
	const actual = await listFiles(outputDirectory)
	const unexplained = actual.filter((path) => !expected.has(path))
	if (unexplained.length > 0)
		throw new Error(`output directory contains unexplained files: ${unexplained.map((path) => relative(outputDirectory, path)).join(', ')}`)
	for (const directory of await readdir(outputDirectory, { withFileTypes: true })) {
		if (directory.isDirectory() && !artifactDirectories.has(directory.name))
			throw new Error(`output directory contains unexplained directory: ${directory.name}`)
	}
}

const assertAttemptEvidence = async ({
	attempt,
	index,
	manifestSha256,
	runId,
	outputDirectory,
	identity,
}: {
	attempt: TerminalizerAttempt
	index: number
	manifestSha256: string
	runId: string
	outputDirectory: string
	identity: RouteRunIdentity
}) => {
	if (attempt.schemaVersion !== controlledRetrySchemaVersion)
		throw new Error(`attempt ${index + 1} has unsupported schema version`)
	if (attempt.runId !== runId)
		throw new Error(`attempt ${index + 1} has an incoherent runId`)
	if (attempt.toolInputHash !== manifestSha256)
		throw new Error(`attempt ${index + 1} has an incoherent toolInputHash`)
	assertHash(attempt.toolOutputHash, `attempt ${index + 1} toolOutputHash`)
	const { toolOutputHash: _toolOutputHash, ...record } = attempt
	if (sha256(canonicalJson(record)) !== attempt.toolOutputHash)
		throw new Error(`attempt ${index + 1} has a corrupted toolOutputHash`)
	if (attempt.terminal !== true)
		throw new Error(`attempt ${index + 1} is not terminal`)
	if (canonicalJson(attempt.runIdentity) !== canonicalJson(identity))
		throw new Error(`attempt ${index + 1} has incoherent run identity`)
	if (attempt.runtimeDiagnostics == null || attempt.classification == null)
		throw new Error(`attempt ${index + 1} omitted classifier/runtime evidence`)
	if (attempt.artifacts.diagnostics == null)
		throw new Error(`attempt ${index + 1} omitted diagnostics artifact`)
	if (attempt.outcome === 'captured' && (attempt.artifacts.screenshot == null || attempt.artifacts.trace == null))
		throw new Error(`attempt ${index + 1} omitted capture artifacts`)
	await assertArtifact(outputDirectory, attempt.artifacts.diagnostics, `attempt ${index + 1} diagnostics`)
	if (attempt.artifacts.screenshot != null)
		await assertArtifact(outputDirectory, attempt.artifacts.screenshot, `attempt ${index + 1} screenshot`)
	if (attempt.artifacts.trace != null)
		await assertArtifact(outputDirectory, attempt.artifacts.trace, `attempt ${index + 1} trace`)
}

const assertInterruptedPrefix = (attempts: readonly TerminalizerAttempt[], manifest: ControlledRetryManifest) => {
	const expected = expectedKeys(manifest)
	const actual = attempts.map(attemptKey)
	const seen = new Set<string>()
	const contexts = new Set<string>()
	for (let index = 0; index < actual.length; index += 1) {
		const key = actual[index]
		if (seen.has(key))
			throw new Error(`attempt ledger contains duplicate key: ${key}`)
		seen.add(key)
		if (key !== expected[index])
			throw new Error(`attempt ledger is not a canonical prefix at index ${index}: expected ${expected[index]}, received ${key}`)
		if (contexts.has(attempts[index].contextId))
			throw new Error(`attempt ledger reused a browser context: ${attempts[index].contextId}`)
		contexts.add(attempts[index].contextId)
	}
	if (actual.length >= expected.length)
		throw new Error('completed attempt ledger cannot be terminalized as incomplete')
	return { observedKeys: actual, missingKeys: expected.slice(actual.length) }
}

export const terminalizeControlledRetry = async ({
	manifestPath,
	outputDirectory,
	productRoot,
	originalRunnerPath,
	terminalizerPath = new URL(import.meta.url).pathname,
}: {
	manifestPath: string
	outputDirectory: string
	productRoot: string
	originalRunnerPath: string
	terminalizerPath?: string
}): Promise<TerminalizedControlledRetryRun> => {
	const manifest: HistoricalManifest = JSON.parse(await readFile(manifestPath, 'utf8'))
	assertManifest(manifest)
	const outputRoot = resolve(outputDirectory)
	const existing = await readdir(outputRoot, { withFileTypes: true }).catch(() => [])
	if (existing.some(({ name }) => name === captureRunFileName || name === captureHistoryFileName))
		throw new Error('controlled retry output already has a terminal summary')
	const [commit, dirtyPatchHash, originalRunnerSha256, terminalizerSha256] = await Promise.all([
		git(productRoot, 'rev-parse', 'HEAD'),
		productDirtyPatchHash(productRoot),
		readFile(originalRunnerPath).then(sha256),
		readFile(terminalizerPath).then(sha256),
	])
	if (commit !== manifest.commit)
		throw new Error(`product commit mismatch: expected ${manifest.commit}, received ${commit}`)
	const expectedDirtyPatchHash = manifest.dirtyPatchHash === null ? sha256('\u0000') : manifest.dirtyPatchHash
	if (dirtyPatchHash !== expectedDirtyPatchHash)
		throw new Error('product tree is dirty or does not match manifest dirtyPatchHash')
	const pinnedRunnerSha256 = manifest.historicalRunnerSha256 ?? manifest.runnerSha256
	if (pinnedRunnerSha256 == null)
		throw new Error('manifest does not pin the original runner SHA-256')
	if (originalRunnerSha256 !== pinnedRunnerSha256)
		throw new Error('original runner SHA-256 does not match manifest')
	if (manifest.runnerSha256 != null && manifest.historicalRunnerSha256 != null && manifest.runnerSha256 !== manifest.historicalRunnerSha256)
		throw new Error('manifest has conflicting runner SHA-256 values')

	const attemptsPath = join(outputRoot, attemptsFileName)
	const attempts = parseAttempts(await readFile(attemptsPath, 'utf8'))
	const manifestSha256 = sha256(canonicalJson(manifest))
	const firstAttempt = attempts[0]
	const identity = await createRouteRunIdentity({
		browserIdentity: firstAttempt.runIdentity.browserIdentity,
		buildIdentity: manifest.server.buildIdentity,
		captureContractVersion: `controlled-retry/${controlledRetrySchemaVersion}`,
		classifierVersion: manifest.classifierVersion,
		corpusVersion: manifest.corpusVersion,
		repositoryDirectory: productRoot,
	})
	const runId = `sha256:${sha256(`${manifestSha256}\u0000${identity.commit}\u0000${identity.dirtyTreeFingerprint}\u0000${originalRunnerSha256}`)}`
	const { observedKeys, missingKeys } = assertInterruptedPrefix(attempts, manifest)
	for (const [index, attempt] of attempts.entries())
		await assertAttemptEvidence({ attempt, index, manifestSha256, runId, outputDirectory: outputRoot, identity })
	await assertOutputFiles(outputRoot, attempts)

	const run = {
		schemaVersion: controlledRetrySchemaVersion,
		runId,
		status: 'incomplete',
		product: { commit, dirtyPatchHash: manifest.dirtyPatchHash },
		tools: {
			runner: basename(originalRunnerPath),
			runnerSha256: originalRunnerSha256,
			browser: firstAttempt.runIdentity.browserIdentity,
			terminalizer: { path: terminalizerPath, sha256: terminalizerSha256 },
		},
		inputs: { manifest, manifestSha256 },
		runIdentity: identity,
		outputs: {
			attempts: attemptsPath,
			artifactsDirectory: outputRoot,
			corpusFingerprint: corpusFingerprint(routeCorpusTargetsFromPathnames(manifest.paths)),
			resultSetFingerprint: resultSetFingerprint(attempts.map((attempt) => ({
				targetId: attempt.pathname,
				exampleId: String(attempt.attempt),
				exampleVersion: attempt.toolOutputHash,
				outcome: attempt.outcome,
			}))),
		},
		counts: {
			completedAttempts: attempts.length,
			expectedAttempts: expectedKeys(manifest).length,
			clean: attempts.filter(({ outcome }) => outcome === 'captured').length,
			failures: attempts.filter(({ outcome }) => outcome === 'failed').length,
		},
		validations: [
			{ name: 'terminalizer-fail-closed-prefix', passed: true },
			{ name: 'product-manifest-runner-identity', passed: true },
			{ name: 'attempt-hashes-artifacts-evidence', passed: true },
		],
		startedAt: attempts[0].startedAt,
		endedAt: attempts.at(-1)?.endedAt ?? attempts[0].endedAt,
		interruption: { disposition: controlledRetryInterruptionDisposition, observedKeys, missingKeys },
	} satisfies TerminalizedControlledRetryRun

	await mkdir(outputRoot, { recursive: true })
	await writeFile(join(outputRoot, captureRunFileName), `${JSON.stringify(run, null, '\t')}\n`)
	await writeFile(join(outputRoot, captureHistoryFileName), `${JSON.stringify(run)}\n`)
	return run
}

const argument = (name: string) => {
	const index = process.argv.indexOf(name)
	return index === -1 ? undefined : process.argv[index + 1]
}

if (process.argv[1] != null && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const manifestPath = argument('--manifest')
	const outputDirectory = argument('--output-directory')
	const productRoot = argument('--product-root')
	const originalRunnerPath = argument('--original-runner') ?? argument('--runner-path')
	if (manifestPath == null || outputDirectory == null || productRoot == null || originalRunnerPath == null)
		throw new Error('usage: controlled-retry-terminalize.mts --manifest PATH --output-directory PATH --product-root PATH --runner-path PATH')
	await terminalizeControlledRetry({ manifestPath, outputDirectory, productRoot, originalRunnerPath })
}
