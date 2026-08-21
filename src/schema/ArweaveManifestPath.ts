// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ArweaveManifestPath,
	labels: {
		singular: 'Arweave manifest path',
		plural: 'Arweave manifest paths',
	},
})({
	$manifest: {
		entityType: EntityType.ArweaveResource,
		cardinality: EntityFieldCardinality.One,
	},
	path: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$resource: {
		entityType: EntityType.ArweaveResource,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Arweave_Rest,
		],
	},
})({
	selectors: {
		ManifestPath: [
			'$manifest',
			'path',
		],
	},
})
