import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum NftCollectionSelector {
	AssetInstance = '$assetInstance',
}
export default {
	entityType: EntityType.NftCollection,
	label: 'NFT collection',
	labelPlural: 'NFT collections',
	selectors: [
		{
			name: NftCollectionSelector.AssetInstance,
			fields: [
				'$assetInstance',
			],
		},
	],
	fields: [
		{
			name: '$assetInstance',
			label: 'asset instance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AssetInstance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$tokens',
			label: 'tokens',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NftToken,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$royaltyTimestamps',
			label: 'royalty timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RoyaltyRight_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
