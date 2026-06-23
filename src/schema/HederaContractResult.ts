import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
export enum HederaContractResultSelector {
	Transaction = '$transaction',
}
export default {
	entityType: EntityType.HederaContractResult,
	label: 'hedera contract result',
	labelPlural: 'hedera contract results',
	selectors: [
		{
			name: HederaContractResultSelector.Transaction,
			fields: [
				'$transaction',
			],
		},
	],
	fields: [
		{
			name: '$transaction',
			label: 'transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HederaTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$contract',
			label: 'contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HederaContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'contractId',
			label: 'contract ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'evmAddress',
			label: 'EVM address',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ethereumHash',
			label: 'ethereum hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'functionParameters',
			label: 'function parameters',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'gasLimit',
			label: 'gas limit',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'gasUsed',
			label: 'gas used',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'amountTinybar',
			label: 'amount tinybar',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'status',
			label: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'errorMessage',
			label: 'error message',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'bloom',
			label: 'bloom',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$actions',
			label: 'actions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaContractAction,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$logs',
			label: 'logs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaContractLog,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
