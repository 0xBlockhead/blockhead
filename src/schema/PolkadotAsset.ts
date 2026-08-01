// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.PolkadotAsset,
	labels: {
		singular: 'Polkadot asset',
		plural: 'Polkadot assets',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	assetKind: {
		label: 'Asset kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	assetId: {
		label: 'Asset ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$balanceTimestamps: {
		label: 'Balance observations',
		entityType: EntityType.PolkadotAssetBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'Asset observations',
		entityType: EntityType.PolkadotAsset_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAssetKindAssetId: [
			'$network',
			'assetKind',
			'assetId',
		],
	},
})
