// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CelestiaNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blocks: {
		label: 'blocks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CelestiaBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$namespaces: {
		label: 'namespaces',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CelestiaNamespace,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blobs: {
		label: 'blobs',
		type: EntityFieldType.EntitiesReference,
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
