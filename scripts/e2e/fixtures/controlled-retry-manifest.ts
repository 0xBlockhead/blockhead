import {
	controlledRetrySchemaVersion,
	type ControlledRetryManifest,
} from '../controlled-retry.mts'

export const createControlledRetryFixtureManifest = (commit: string): ControlledRetryManifest => ({
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
