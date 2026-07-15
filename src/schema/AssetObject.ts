// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AssetObjectSelector {
	AssetInstanceObjectKey = 'AssetInstanceObjectKey',
}
export const AssetObject = entity({
	entityType: EntityType.AssetObject,
	labels: {
		singular: 'asset object',
		plural: 'asset objects',
	},
	description: 'A distinct asset object or item within an asset instance, such as an NFT or uniquely addressable collectible.',
})({
	$assetInstance: {
		label: 'asset instance',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.One,
	},
	objectKey: {
		label: 'object key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	objectKind: {
		label: 'object kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$class: {
		label: 'class',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AssetClass,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tokenId: {
		label: 'Token ID',
		description: 'The token identifier within its collection or contract.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slot: {
		label: 'slot',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metadataUri: {
		label: 'metadata URI',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$metadata: {
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TokenMetadataDocument,
		cardinality: EntityFieldCardinality.Many,
	},
	$$usageRights: {
		label: 'usage rights',
		type: EntityFieldType.EntitiesReference,
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
