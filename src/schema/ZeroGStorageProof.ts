// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ZeroGStorageProofSelector {
	ZeroGStorageNodeProofId = 'ZeroGStorageNodeProofId',
}
export default {
	entityType: EntityType.ZeroGStorageProof,
	label: 'zero g storage proof',
	labelPlural: 'zero g storage proofs',
	selectors: [
		{
			name: ZeroGStorageProofSelector.ZeroGStorageNodeProofId,
			fields: [
				'$storageNode',
				'proofId',
			],
		},
	],
	fields: [
		{
				name: '$storageNode',
				label: 'storage node',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.ZeroGStorageNode,
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
				name: '$consensusNetwork',
				label: 'consensus network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.ZeroGConsensusNetwork,
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
				name: 'verifiedAtBlock',
				label: 'verified AT block',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
