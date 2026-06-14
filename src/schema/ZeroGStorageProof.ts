import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import ZeroGStorageNode from '$/schema/ZeroGStorageNode.ts'

export enum ZeroGStorageProofSelector {
	ZeroGStorageNodeProofId = 'zeroGStorageNodeProofId',
}

export default {
	entityType: EntityType.ZeroGStorageProof,

	label: '0G storage proof',
	labelPlural: '0G storage proofs',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGStorageNode,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'proofId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$dataBlob',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGDataBlob,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$consensusNetwork',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGConsensusNetwork,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'proofKind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'verifiedAtBlock',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
