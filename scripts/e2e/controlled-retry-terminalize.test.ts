import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import test from 'node:test'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import {
	controlledRetrySchemaVersion,
	productDirtyPatchHash,
	type ControlledRetryAttempt,
	type ControlledRetryManifest,
} from './controlled-retry.mts'
import {
	canonicalJson,
	createRouteRunIdentity,
} from './routeRunIdentity.ts'
import {
	controlledRetryInterruptionDisposition,
	terminalizeControlledRetry,
} from './controlled-retry-terminalize.mts'

const sha256 = (value: string | Uint8Array) => createHash('sha256').update(value).digest('hex')
const runnerPath = join(process.cwd(), 'scripts/e2e/controlled-retry.mts')

const createFixture = async (count = 43) => {
	const productRoot = process.cwd()
	const fixtureRoot = await mkdtemp(join(tmpdir(), 'controlled-retry-terminalize-'))
	const outputDirectory = join(fixtureRoot, 'output')
	const manifestPath = join(fixtureRoot, 'manifest.json')
	await mkdir(outputDirectory)
	const paths = Array.from({ length: 22 }, (_, index) => `/fixture/${String(index).padStart(2, '0')}`)
	const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: productRoot }).toString().trim()
	const historicalRunnerSha256 = sha256(await readFile(runnerPath))
	const manifest = {
		schemaVersion: controlledRetrySchemaVersion,
		ids: ['fixture'],
		paths,
		commit,
		dirtyPatchHash: await productDirtyPatchHash(productRoot),
		workers: 1,
		freshContextPerAttempt: true,
		attempts: 2,
		runnerSha256: null,
		historicalRunnerSha256,
		server: { url: 'http://127.0.0.1:4173/', buildIdentity: 'fixture-build' },
		corpusVersion: 'fixture-corpus',
		classifierVersion: 'fixture-classifier',
	} satisfies ControlledRetryManifest & { historicalRunnerSha256: string }
	await writeFile(manifestPath, `${JSON.stringify(manifest)}\n`)
	await mkdir(join(outputDirectory, 'diagnostics'))
	await mkdir(join(outputDirectory, 'screenshots'))
	await mkdir(join(outputDirectory, 'traces'))

	const identity = await createRouteRunIdentity({
		browserIdentity: 'fixture chromium 1',
		buildIdentity: manifest.server.buildIdentity,
		captureContractVersion: `controlled-retry/${controlledRetrySchemaVersion}`,
		classifierVersion: manifest.classifierVersion,
		corpusVersion: manifest.corpusVersion,
		repositoryDirectory: productRoot,
	})
	const manifestSha256 = sha256(canonicalJson(manifest))
	const runId = `sha256:${sha256(`${manifestSha256}\u0000${identity.commit}\u0000${identity.dirtyTreeFingerprint}\u0000${historicalRunnerSha256}`)}`
	const attempts: ControlledRetryAttempt[] = []
	for (const pathname of paths) for (let attempt = 1; attempt <= manifest.attempts; attempt += 1) {
		const index = attempts.length + 1
		const stem = `${String(index).padStart(2, '0')}-${attempt}`
		const diagnosticsPath = join(outputDirectory, 'diagnostics', `${stem}.html`)
		const screenshotPath = join(outputDirectory, 'screenshots', `${stem}.png`)
		const tracePath = join(outputDirectory, 'traces', `${stem}.zip`)
		await writeFile(diagnosticsPath, `diagnostics-${index}`)
		await writeFile(screenshotPath, `screenshot-${index}`)
		await writeFile(tracePath, `trace-${index}`)
		const record: Omit<ControlledRetryAttempt, 'toolOutputHash'> = {
			schemaVersion: controlledRetrySchemaVersion,
			runId,
			pathname,
			attempt,
			contextId: `context-${index}`,
			terminal: true,
			outcome: 'captured' as const,
			detail: '',
			startedAt: '2026-08-23T00:00:00.000Z',
			endedAt: '2026-08-23T00:00:01.000Z',
			runIdentity: identity,
			artifacts: {
				screenshot: { path: screenshotPath, sha256: sha256(await readFile(screenshotPath)) },
				trace: { path: tracePath, sha256: sha256(await readFile(tracePath)) },
				diagnostics: { path: diagnosticsPath, sha256: sha256(await readFile(diagnosticsPath)) },
			},
			runtimeDiagnostics: {
				console: [], pageErrors: [], requestFailures: [], main: {
					boundaryEvents: [], contentHeight: 1, mainText: 'fixture',
					overflow: { carouselX: 0, pageX: 0, pageY: 0 },
					settled: { empty: false, failed: [], loading: [] }, finalUrl: `http://127.0.0.1:4173${pathname}`,
					readyState: 'complete', visible: true, textLength: 7, contentMarkerCount: 1,
				},
			},
			classification: { failures: [], warnings: [] },
			toolInputHash: manifestSha256,
		}
		attempts.push({ ...record, toolOutputHash: sha256(canonicalJson(record)) })
	}
	await writeFile(join(outputDirectory, 'attempts.jsonl'), `${attempts.slice(0, count).map((attempt) => JSON.stringify(attempt)).join('\n')}\n`)
	for (const attempt of attempts.slice(count)) {
		for (const artifact of Object.values(attempt.artifacts))
			if (artifact != null)
				await rm(artifact.path)
	}
	return { manifestPath, outputDirectory, attempts, manifest }
}

test('terminalizes a valid 43-attempt canonical prefix and records exact disposition', async () => {
	const fixture = await createFixture()
	const run = await terminalizeControlledRetry({ ...fixture, productRoot: process.cwd(), originalRunnerPath: runnerPath })
	assert.equal(run.status, 'incomplete')
	assert.equal(run.counts.completedAttempts, 43)
	assert.equal(run.interruption.disposition, controlledRetryInterruptionDisposition)
	assert.deepEqual(run.interruption.missingKeys, ['/fixture/21\u00002'])
	assert.equal(run.tools.terminalizer.path.endsWith('controlled-retry-terminalize.mts'), true)
})

test('rejects corrupted attempt hash, duplicate/non-prefix key, and artifact mismatch', async (t) => {
	for (const [label, mutate, expected] of [
		['corrupted hash', (attempts: ControlledRetryAttempt[]) => { attempts[0].toolOutputHash = '0'.repeat(64) }, /corrupted toolOutputHash/],
		['duplicate key', (attempts: ControlledRetryAttempt[]) => { attempts[1].attempt = attempts[0].attempt }, /duplicate key|canonical prefix/],
		['artifact mismatch', (attempts: ControlledRetryAttempt[]) => { attempts[0].artifacts.diagnostics.sha256 = '0'.repeat(64) }, /artifact SHA-256 mismatch/],
	] as const) {
		await t.test(label, async () => {
			const fixture = await createFixture()
			const lines = (await readFile(join(fixture.outputDirectory, 'attempts.jsonl'), 'utf8')).trim().split('\n').map((line) => JSON.parse(line) as ControlledRetryAttempt)
			mutate(lines)
			if (label !== 'corrupted hash') {
				for (const attempt of lines) {
					const { toolOutputHash: _toolOutputHash, ...record } = attempt
					attempt.toolOutputHash = sha256(canonicalJson(record))
				}
			}
			await writeFile(join(fixture.outputDirectory, 'attempts.jsonl'), `${lines.map((attempt) => JSON.stringify(attempt)).join('\n')}\n`)
			await assert.rejects(
				terminalizeControlledRetry({ ...fixture, productRoot: process.cwd(), originalRunnerPath: runnerPath }),
				expected
			)
		})
	}
})

test('refuses an output directory with an existing completed ledger', async () => {
	const fixture = await createFixture()
	await writeFile(join(fixture.outputDirectory, 'capture-run.json'), JSON.stringify({ status: 'completed' }))
	await assert.rejects(
		terminalizeControlledRetry({ ...fixture, productRoot: process.cwd(), originalRunnerPath: runnerPath }),
		/output already has a terminal summary/
	)
})
