import assert from 'node:assert/strict'
import test from 'node:test'

import {
	assertRouteReportCoherent,
	assertRouteCheckpointCoherent,
	assertRouteCorpusArtifactCoherent,
	assertRouteResultEntriesCoherent,
	assertRouteResultsArtifactCoherent,
	assertRouteResultsCoherent,
	assertRunIdentityMatches,
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
	version: 1,
	commit: 'commit-a',
	dirtyTreeFingerprint: 'dirty-a',
	appGeneratedRouteFingerprint: 'app-a',
	fixtureMetadataFingerprint: 'fixtures-a',
	corpusVersion: 'corpus-a',
	captureContractVersion: 'capture-a',
	classifierVersion: 'classifier-a',
	buildIdentity: 'build-a',
	browserIdentity: 'browser-a',
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
		'commit',
		'dirtyTreeFingerprint',
		'appGeneratedRouteFingerprint',
		'fixtureMetadataFingerprint',
		'corpusVersion',
		'captureContractVersion',
		'classifierVersion',
		'buildIdentity',
		'browserIdentity',
	] as const) {
		const actual = { ...identity, [field]: `${identity[field]}-changed` }
		assert.throws(
			() => assertRunIdentityMatches(identity, actual, 'checkpoint'),
			new RegExp(`checkpoint has incoherent run identity: ${field}`),
		)
	}
})

test('requires an exact, versioned result for every corpus example', () => {
	assert.doesNotThrow(() => assertRouteResultsCoherent({ corpusTargets: targets, results, runIdentity: identity }))
	assert.doesNotThrow(() => assertRouteResultsArtifactCoherent({
		artifact: { runIdentity: identity, corpusFingerprint: corpusFingerprint(targets), results } satisfies RouteResultsArtifact,
		corpusTargets: targets,
		runIdentity: identity,
	}))
	assert.throws(
		() => assertRouteResultsCoherent({
			corpusTargets: targets,
			results: results.map((result, index) => index === 0 ? { ...result, exampleVersion: 'stale' } : result),
			runIdentity: identity,
		}),
		/stale example version/,
	)
	assert.throws(
		() => assertRouteResultsCoherent({ corpusTargets: targets, results: results.slice(0, 1), runIdentity: identity }),
		/result set is incomplete/,
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
		/checkpoint has incoherent corpus fingerprint/,
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
		/gallery.html has incoherent run identity/,
	)
	assert.throws(
		() => assertRouteReportCoherent({
			acceptedResults: results.slice(0, 1),
			corpusTargets: targets,
			report,
			runIdentity: identity,
			reportName: 'gallery.html',
		}),
		/not derived from the accepted result set/,
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
		/corpus artifact targets do not match/,
	)
	assert.throws(
		() => assertRouteCorpusArtifactCoherent({
			artifact: { ...artifact, targets: [targets[0], targets[0]] },
			corpusTargets: targets,
			runIdentity: identity,
		}),
		/corpus contains duplicate target/,
	)
})

test('adapts discovered pathnames into stable versioned route results', () => {
	const corpus = routeCorpusTargetsFromPathnames(['/zeta', '/alpha'])
	assert.deepEqual(corpus.map(({ id }) => id), ['/alpha', '/zeta'])
	assert.equal(corpus[0]?.examples[0]?.id, 'default')
	assert.equal(
		routeResultFromReport({ pathname: '/alpha' }, corpus).exampleVersion,
		corpus[0]?.examples[0]?.version,
	)
	assert.deepEqual(
		routeResultFromReport({ pathname: '/alpha', targetId: 'spoofed', exampleId: 'spoofed', exampleVersion: 'stale' }, corpus),
		{ pathname: '/alpha', targetId: '/alpha', exampleId: 'default', exampleVersion: corpus[0]?.examples[0]?.version },
	)
	assert.throws(
		() => routeResultFromReport({ pathname: '/missing' }, corpus),
		/unknown corpus target/
	)
})
