import assert from 'node:assert/strict'
import test from 'node:test'
import { spawn } from 'node:child_process'

import {
	assertRouteReportCoherent,
	assertRouteCheckpointCoherent,
	assertRouteCorpusArtifactCoherent,
	assertRouteResultEntriesCoherent,
	assertRouteResultsArtifactCoherent,
	assertRouteResultsCoherent,
	assertRunIdentityMatches,
	acquireExclusiveWriterLock,
	createRouteRunIdentity,
	historicalRouteRunId,
	corpusFingerprint,
	resultSetFingerprint,
	routeCorpusTargetsFromPathnames,
	routeResultFromReport,
	type RouteCorpusTarget,
	type RouteCheckpoint,
	type RouteReport,
	type RouteResult,
	type RouteResultsArtifact,
	type RouteRunIdentity,
} from './routeRunIdentity.ts'

const identity = {
	version: 2,
	runId: 'sha256:run-a',
	commit: 'commit-a',
	dirtyTreeFingerprint: 'dirty-a',
	appGeneratedRouteFingerprint: 'app-a',
	fixtureMetadataFingerprint: 'fixtures-a',
	corpusVersion: 'corpus-a',
	captureContractVersion: 'capture-a',
	classifierVersion: 'classifier-a',
	buildIdentity: 'build-a',
	browserIdentity: 'browser-a',
	captureConfigFingerprint: 'capture-a',
	attemptCohort: 'cohort-a',
	artifactRoot: '/artifacts/run-a',
} as const satisfies RouteRunIdentity

const targets = [
	{
		id: 'target-a',
		examples: [
			{ id: 'example-a', version: 'example-a-v1' },
			{ id: 'example-b', version: 'example-b-v1' },
		],
	},
] as const satisfies readonly RouteCorpusTarget[]

const results = [
	{ targetId: 'target-a', exampleId: 'example-a', exampleVersion: 'example-a-v1', status: 'captured' },
	{ targetId: 'target-a', exampleId: 'example-b', exampleVersion: 'example-b-v1', status: 'failed' },
] as const satisfies readonly RouteResult[]

test('rejects every identity dimension that can invalidate a route report', () => {
	for (const field of [
		'runId', 'commit',
		'dirtyTreeFingerprint',
		'appGeneratedRouteFingerprint',
		'fixtureMetadataFingerprint',
		'corpusVersion',
		'captureContractVersion',
		'classifierVersion',
		'buildIdentity',
		'browserIdentity',
		'captureConfigFingerprint',
		'attemptCohort',
		'artifactRoot',
	] as const) {
		const actual = { ...identity, [field]: `${identity[field]}-changed` }
		assert.throws(
			() => assertRunIdentityMatches(identity, actual, 'checkpoint'),
			new RegExp(`checkpoint has incoherent run identity: ${field}`)
		)
	}
})

test('writer lock rejects active owners and recovers stale owners deterministically', async () => {
	const { mkdtemp, writeFile } = await import('node:fs/promises')
	const { tmpdir } = await import('node:os')
	const { join } = await import('node:path')
	const root = await mkdtemp(join(tmpdir(), 'route-run-lock-'))
	const release = await acquireExclusiveWriterLock(root)
	const liveChild = spawn(process.execPath, ['-e', 'setTimeout(() => {}, 5000)'])
	await new Promise((resolve) => liveChild.once('spawn', resolve))
	await writeFile(`${root}.route-run-writer.lock`, JSON.stringify({ pid: liveChild.pid, token: 'live' }))
	await assert.rejects(acquireExclusiveWriterLock(root), /writer lock is active/)
	liveChild.kill()
	await release()
	await writeFile(`${root}.route-run-writer.lock`, '{"pid":999999,"token":"stale"}\n')
	const staleRelease = await acquireExclusiveWriterLock(root)
	await staleRelease()
	const first = await acquireExclusiveWriterLock(root)
	const second = await acquireExclusiveWriterLock(root).catch(() => null)
	assert.equal(second, null)
	await writeFile(`${root}.route-run-writer.lock`, '{"pid":999999,"token":"successor"}\n')
	await first()
	assert.match(await (await import('node:fs/promises')).readFile(`${root}.route-run-writer.lock`, 'utf8'), /successor/)
})

test('writer lock does not create or mutate a missing artifact root', async () => {
	const { mkdtemp, stat, readFile } = await import('node:fs/promises')
	const { tmpdir } = await import('node:os')
	const { join } = await import('node:path')
	const parent = await mkdtemp(join(tmpdir(), 'route-run-lock-parent-'))
	const root = join(parent, 'missing-artifacts')
	const release = await acquireExclusiveWriterLock(root)
	assert.equal(await stat(root).catch(() => null), null)
	await release()
	assert.equal(await readFile(`${root}.route-run-writer.lock`, 'utf8').catch(() => null), null)
})

test('preserves v1 historical runId derivation and canonicalizes artifact roots', async () => {
	assert.match(historicalRouteRunId({ manifestSha256: 'manifest', commit: 'commit', dirtyTreeFingerprint: 'dirty', runnerSha256: 'runner' }), /^sha256:[0-9a-f]{64}$/)
	const repositoryDirectory = process.cwd()
	const relative = await createRouteRunIdentity({
		browserIdentity: 'browser', buildIdentity: 'build', captureContractVersion: 'capture', classifierVersion: 'classifier', corpusVersion: 'corpus',
		repositoryDirectory, artifactRoot: '.',
	})
	const absolute = await createRouteRunIdentity({
		browserIdentity: 'browser', buildIdentity: 'build', captureContractVersion: 'capture', classifierVersion: 'classifier', corpusVersion: 'corpus',
		repositoryDirectory, artifactRoot: repositoryDirectory,
	})
	assert.equal(relative.artifactRoot, absolute.artifactRoot)
	assert.equal(relative.runId, absolute.runId)
})

test('requires an exact, versioned result for every corpus example', () => {
	assert.doesNotThrow(() => assertRouteResultsCoherent({ corpusTargets: targets, results, runIdentity: identity }))
	assert.doesNotThrow(() => assertRouteResultsArtifactCoherent({
		artifact: { runIdentity: identity, corpusFingerprint: corpusFingerprint(targets), results } satisfies RouteResultsArtifact,
		corpusTargets: targets,
		runIdentity: identity,
	}))
	assert.throws(
		() => assertRouteResultsArtifactCoherent({
			artifact: { runIdentity: identity, corpusFingerprint: 'stale', results },
			corpusTargets: targets,
			runIdentity: identity,
		}),
		/results has incoherent corpus fingerprint/
	)
	assert.throws(
		() => assertRouteResultsCoherent({
			corpusTargets: targets,
			results: results.map((result, index) => index === 0 ? { ...result, exampleVersion: 'stale' } : result),
			runIdentity: identity,
		}),
		/stale example version/
	)
	assert.throws(
		() => assertRouteResultsCoherent({ corpusTargets: targets, results: results.slice(0, 1), runIdentity: identity }),
		/result set is incomplete/
	)
})

test('reports reject stale checkpoints and reports derived from another result set', () => {
	const checkpoint = {
		runIdentity: identity,
		corpusFingerprint: corpusFingerprint(targets),
		results: results.slice(0, 1),
	} satisfies RouteCheckpoint
	assert.doesNotThrow(() => assertRouteCheckpointCoherent({
		checkpoint,
		corpusTargets: targets,
		runIdentity: identity,
	}))
	assert.throws(
		() => assertRouteCheckpointCoherent({
			checkpoint: { ...checkpoint, corpusFingerprint: 'stale' },
			corpusTargets: targets,
			runIdentity: identity,
		}),
		/checkpoint has incoherent corpus fingerprint/
	)
	assert.doesNotThrow(() => assertRouteResultEntriesCoherent({
		corpusTargets: targets,
		results: results.slice(0, 1),
	}))

	const report = {
		runIdentity: identity,
		corpusFingerprint: corpusFingerprint(targets),
		resultSetFingerprint: resultSetFingerprint(results),
	} satisfies RouteReport
	assert.doesNotThrow(() => assertRouteReportCoherent({
		acceptedResults: results,
		corpusTargets: targets,
		report,
		runIdentity: identity,
		reportName: 'gallery.html',
	}))
	assert.throws(
		() => assertRouteReportCoherent({
			acceptedResults: results,
			corpusTargets: targets,
			report: { ...report, runIdentity: { ...identity, classifierVersion: 'classifier-b' } },
			runIdentity: identity,
			reportName: 'gallery.html',
		}),
		/gallery.html has incoherent run identity/
	)
	assert.throws(
		() => assertRouteReportCoherent({
			acceptedResults: results,
			corpusTargets: targets,
			report: { ...report, corpusFingerprint: 'stale' },
			runIdentity: identity,
			reportName: 'gallery.html',
		}),
		/gallery.html has incoherent corpus fingerprint/
	)
	assert.throws(
		() => assertRouteReportCoherent({
			acceptedResults: results.slice(0, 1),
			corpusTargets: targets,
			report,
			runIdentity: identity,
			reportName: 'gallery.html',
		}),
		/not derived from the accepted result set/
	)
})

test('corpus artifacts reject target or example-version drift', () => {
	const artifact = {
		runIdentity: identity,
		corpusFingerprint: corpusFingerprint(targets),
		targets,
	}
	assert.doesNotThrow(() => assertRouteCorpusArtifactCoherent({
		artifact,
		corpusTargets: targets,
		runIdentity: identity,
	}))
	assert.throws(
		() => assertRouteCorpusArtifactCoherent({
			artifact: { ...artifact, targets: [{ ...targets[0], examples: [{ ...targets[0].examples[0], version: 'stale' }] }] },
			corpusTargets: targets,
			runIdentity: identity,
		}),
		/corpus artifact targets do not match/
	)
	assert.throws(
		() => assertRouteCorpusArtifactCoherent({
			artifact: { ...artifact, targets: [targets[0], targets[0]] },
			corpusTargets: targets,
			runIdentity: identity,
		}),
		/corpus contains duplicate target/
	)
})

test('adapts discovered pathnames into stable versioned route results', () => {
	const corpus = routeCorpusTargetsFromPathnames(['/zeta', '/alpha'])
	assert.deepEqual(corpus.map(({ id }) => id), ['/alpha', '/zeta'])
	assert.equal(corpus[0]?.examples[0]?.id, 'default')
	assert.equal(
		routeResultFromReport({ pathname: '/alpha' }, corpus).exampleVersion,
		corpus[0]?.examples[0]?.version
	)
	assert.deepEqual(
		routeResultFromReport({ pathname: '/alpha', targetId: 'spoofed', exampleId: 'spoofed', exampleVersion: 'stale' }, corpus),
		{ pathname: '/alpha', targetId: '/alpha', exampleId: 'default', exampleVersion: corpus[0]?.examples[0]?.version }
	)
	assert.throws(
		() => routeResultFromReport({ pathname: '/missing' }, corpus),
		/unknown corpus target/
	)
})
