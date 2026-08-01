// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.NftCollection,
	labels: {
		singular: 'NFT collection',
		plural: 'NFT collections',
	},
})({
	$assetInstance: {
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.One,
	},
	$$tokens: {
		entityType: EntityType.NftToken,
		cardinality: EntityFieldCardinality.Many,
	},
	$$royaltyTimestamps: {
		entityType: EntityType.RoyaltyRight_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		AssetInstance: [
			'$assetInstance',
		],
	},
})
