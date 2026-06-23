import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum TezosInternalOperationSelector {
	ParentOperationInternalIndex = '$parentOperation+internalIndex',
}
export default {
	entityType: EntityType.TezosInternalOperation,
	label: 'tezos internal operation',
	labelPlural: 'tezos internal operations',
	selectors: [
		{
			name: TezosInternalOperationSelector.ParentOperationInternalIndex,
			fields: [
				'$parentOperation',
				'internalIndex',
			],
		},
	],
	fields: [
		{
			name: '$parentOperation',
			label: 'parent operation',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TezosOperation,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'internalIndex',
			label: 'internal index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'operationKind',
			label: 'operation kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'sourceAddress',
			label: 'source address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'destinationAddress',
			label: 'destination address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'amountMutez',
			label: 'amount mutez',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'nonce',
			label: 'nonce',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'parameters',
			label: 'parameters',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'resultStatus',
			label: 'result status',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'consumedGas',
			label: 'consumed gas',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
