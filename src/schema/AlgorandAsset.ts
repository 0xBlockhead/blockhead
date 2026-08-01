// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AlgorandAsset,
	labels: {
		singular: 'algorand asset',
		plural: 'algorand assets',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.AlgorandNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	assetId: {
		label: 'asset ID',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	creator: {
		label: 'creator',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$holdingRounds: {
		label: 'holding rounds',
		entityType: EntityType.AlgorandAssetHolding_Round,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.AlgorandAsset_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAssetId: [
			'$network',
			'assetId',
		],
	},
})
