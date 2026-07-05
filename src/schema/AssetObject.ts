// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AssetObjectSelector {
	AssetInstanceObjectKey = 'AssetInstanceObjectKey',
}
export default {
	entityType: EntityType.AssetObject,
	label: 'asset object',
	labelPlural: 'asset objects',
	description: 'A distinct asset object or item within an asset instance, such as an NFT or uniquely addressable collectible.',
	selectors: [
		{
			name: AssetObjectSelector.AssetInstanceObjectKey,
			fields: [
				'$assetInstance',
				'objectKey',
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
				name: 'objectKey',
				label: 'object key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'objectKind',
				label: 'object kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$class',
				label: 'class',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AssetClass,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'tokenId',
				label: 'Token ID',
				description: 'The token identifier within its collection or contract.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'slot',
				label: 'slot',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'metadataUri',
				label: 'metadata URI',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$metadata',
				label: 'metadata',
				labelPlural: 'metadata',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.TokenMetadataDocument,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$usageRights',
				label: 'usage rights',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.UsageRight_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
