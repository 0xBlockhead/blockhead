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
		label: 'collection',
		entityType: EntityType.NftCollection,
		cardinality: EntityFieldCardinality.One,
	},
	tokenKey: {
		label: 'token key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	tokenId: {
		label: 'Token ID',
		description: 'The token identifier within its collection or contract.',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$assetObject: {
		label: 'asset object',
		entityType: EntityType.AssetObject,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$metadata: {
		label: 'metadata',
		entityType: EntityType.TokenMetadataDocument,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$usageRightTimestamps: {
		label: 'usage right timestamps',
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
