// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum NftTokenSelector {
	CollectionTokenKey = 'CollectionTokenKey',
}
export const NftToken = entity({
	entityType: EntityType.NftToken,
	labels: {
		singular: 'NFT token',
		plural: 'NFT tokens',
	},
})({
	$collection: {
		label: 'collection',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.NftCollection,
		cardinality: EntityFieldCardinality.One,
	},
	tokenKey: {
		label: 'token key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	tokenId: {
		label: 'Token ID',
		description: 'The token identifier within its collection or contract.',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$assetObject: {
		label: 'asset object',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AssetObject,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$metadata: {
		label: 'metadata',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TokenMetadataDocument,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$usageRightTimestamps: {
		label: 'usage right timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.UsageRight_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		CollectionTokenKey: [
			'$collection',
			'tokenKey',
		],
	},
})
