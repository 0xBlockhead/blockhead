import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum NftTokenSelector {
	CollectionTokenKey = '$collection+tokenKey',
}
export default {
	entityType: EntityType.NftToken,
	label: 'NFT token',
	labelPlural: 'NFT tokens',
	selectors: [
		{
			name: NftTokenSelector.CollectionTokenKey,
			fields: [
				'$collection',
				'tokenKey',
			],
		},
	],
	fields: [
		{
			name: '$collection',
			label: 'collection',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NftCollection,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'tokenKey',
			label: 'token key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'tokenId',
			label: 'Token ID',
			description: 'The token identifier within its collection or contract.',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$assetObject',
			label: 'asset object',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AssetObject,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$metadata',
			label: 'metadata',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TokenMetadataDocument,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$usageRightTimestamps',
			label: 'usage right timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.UsageRight_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
