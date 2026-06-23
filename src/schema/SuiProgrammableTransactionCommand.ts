import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum SuiProgrammableTransactionCommandSelector {
	TransactionCommandIndex = '$transaction+commandIndex',
}
export default {
	entityType: EntityType.SuiProgrammableTransactionCommand,
	label: 'sui programmable transaction command',
	labelPlural: 'sui programmable transaction commands',
	selectors: [
		{
			name: SuiProgrammableTransactionCommandSelector.TransactionCommandIndex,
			fields: [
				'$transaction',
				'commandIndex',
			],
		},
	],
	fields: [
		{
			name: '$transaction',
			label: 'transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SuiTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'commandIndex',
			label: 'command index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'commandKind',
			label: 'command kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'packageId',
			label: 'package ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'moduleName',
			label: 'module name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'functionName',
			label: 'function name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'typeArguments',
			label: 'type arguments',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'arguments',
			label: 'arguments',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
