// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CelestiaNetwork,
	labels: {
		singular: 'celestia network',
		plural: 'celestia networks',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.CelestiaNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blocks: {
		label: 'blocks',
		entityType: EntityType.CelestiaBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$namespaces: {
		label: 'namespaces',
		entityType: EntityType.CelestiaNamespace,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blobs: {
		label: 'blobs',
		entityType: EntityType.CelestiaBlob,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
