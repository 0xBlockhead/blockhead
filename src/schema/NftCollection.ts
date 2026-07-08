// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum NftCollectionSelector {
	AssetInstance = 'AssetInstance',
}
export const NftCollection = entity({
	entityType: EntityType.NftCollection,
	label: 'NFT collection',
	labelPlural: 'NFT collections',
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
