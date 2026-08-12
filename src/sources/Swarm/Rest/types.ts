import { type as arktype } from 'arktype'

const swarmReference = arktype('/^[A-Fa-f0-9]{64}(?:[A-Fa-f0-9]{64})?$/')

export const swarmManifestWire = arktype({
	manifest: {
		version: 'string > 0',
		'indexDocument?': 'string',
		'errorDocument?': 'string',
	},
	entries: arktype({
		path: 'string',
		hash: 'string',
		'contentType?': 'string',
		'size?': 'number.integer >= 0',
	}).array(),
})

export type SwarmManifest = typeof swarmManifestWire.infer
export type SwarmManifestEntry = SwarmManifest['entries'][number]

export { swarmReference }
