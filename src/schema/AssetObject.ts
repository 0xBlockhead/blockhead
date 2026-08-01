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
		label: 'asset instance',
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.One,
	},
	objectKey: {
		label: 'object key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	objectKind: {
		label: 'object kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$class: {
		label: 'class',
		entityType: EntityType.AssetClass,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tokenId: {
		label: 'Token ID',
		description: 'The token identifier within its collection or contract.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slot: {
		label: 'slot',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metadataUri: {
		label: 'metadata URI',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$metadata: {
		entityType: EntityType.TokenMetadataDocument,
		cardinality: EntityFieldCardinality.Many,
	},
	$$usageRights: {
		label: 'usage rights',
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
