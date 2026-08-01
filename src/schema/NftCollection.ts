// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		label: 'asset instance',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.One,
	},
	$$tokens: {
		label: 'tokens',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.NftToken,
		cardinality: EntityFieldCardinality.Many,
	},
	$$royaltyTimestamps: {
		label: 'royalty timestamps',
		type: EntityFieldType.EntitiesReference,
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
