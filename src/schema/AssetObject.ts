// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AssetObject,
	labels: {
		singular: 'asset object',
		plural: 'asset objects',
	},
	description: 'A distinct asset object or item within an asset instance, such as an NFT or uniquely addressable collectible.',
})({
	$assetInstance: {
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.One,
	},
	objectKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	objectKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$class: {
		entityType: EntityType.AssetClass,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tokenId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slot: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metadataUri: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$metadata: {
		entityType: EntityType.TokenMetadataDocument,
		cardinality: EntityFieldCardinality.Many,
	},
	$$usageRights: {
		entityType: EntityType.UsageRight_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		AssetInstanceObjectKey: [
			'$assetInstance',
			'objectKey',
		],
	},
})
