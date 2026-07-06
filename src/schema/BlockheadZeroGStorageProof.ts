// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadZeroGStorageProofSelector {
	NodeStateProofId = 'NodeStateProofId',
}
export default {
	entityType: EntityType.BlockheadZeroGStorageProof,
	label: 'blockhead zero g storage proof',
	labelPlural: 'blockhead zero g storage proofs',
	selectors: [
		{
			name: BlockheadZeroGStorageProofSelector.NodeStateProofId,
			fields: [
				'$nodeState',
				'proofId',
			],
		},
	],
	fields: [
		{
			name: '$nodeState',
			label: 'node state',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadZeroGStorageNodeState,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'proofId',
			label: 'proof ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$dataBlob',
			label: 'data blob',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGDataBlob,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$chunk',
			label: 'chunk',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadZeroGStoredChunk,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'proofKind',
			label: 'proof kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'proofBytes',
			label: 'proof bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'verified',
			label: 'verified',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'verifiedAt',
			label: 'verified AT',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'verifiedAtBlock',
			label: 'verified AT block',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'error',
			label: 'error',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
