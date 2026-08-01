// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.NftToken,
	labels: {
		singular: 'NFT token',
		plural: 'NFT tokens',
	},
})({
	$collection: {
		entityType: EntityType.NftCollection,
		cardinality: EntityFieldCardinality.One,
	},
	tokenKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	tokenId: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$assetObject: {
		entityType: EntityType.AssetObject,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$metadata: {
		entityType: EntityType.TokenMetadataDocument,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$usageRightTimestamps: {
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
