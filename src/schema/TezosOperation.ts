// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TezosOperationSelector {
	OperationGroupContentIndex = 'OperationGroupContentIndex',
}
export default {
	entityType: EntityType.TezosOperation,
	label: 'tezos operation',
	labelPlural: 'tezos operations',
	selectors: [
		{
			name: TezosOperationSelector.OperationGroupContentIndex,
			fields: [
				'$operationGroup',
				'contentIndex',
			],
		},
	],
	fields: [
		{
				name: '$operationGroup',
				label: 'operation group',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TezosOperationGroup,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'contentIndex',
				label: 'content index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'operationKind',
				label: 'operation kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'sourceAddress',
				label: 'source address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'destinationAddress',
				label: 'destination address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'delegateAddress',
				label: 'delegate address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'contractAddress',
				label: 'contract address',
				description: 'The contract address on its network.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'counter',
				label: 'counter',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'feeMutez',
				label: 'fee mutez',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'gasLimit',
				label: 'gas limit',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'storageLimit',
				label: 'storage limit',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'amountMutez',
				label: 'amount mutez',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'parameters',
				label: 'parameters',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'status',
				label: 'status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'consumedGas',
				label: 'consumed gas',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'storageSize',
				label: 'storage size',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'paidStorageSizeDiff',
				label: 'paid storage size diff',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'originatedContractAddresses',
				label: 'originated contract addresses',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$block',
				label: 'block',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TezosBlock,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$internalOperations',
				label: 'internal operations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.TezosInternalOperation,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$bigMapDiffs',
				label: 'big map diffs',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.TezosBigMapDiff,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
