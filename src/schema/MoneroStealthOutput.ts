import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum MoneroStealthOutputSelector {
	MoneroTransactionOutputIndex = 'moneroTransactionOutputIndex',
	TransactionOutputIndex = '$transaction+outputIndex',
}
export default {
	entityType: EntityType.MoneroStealthOutput,
	label: 'monero stealth output',
	labelPlural: 'monero stealth outputs',
	selectors: [
		{
			name: MoneroStealthOutputSelector.MoneroTransactionOutputIndex,
			fields: [
				'$transaction',
				'outputIndex',
			],
		},
	],
	fields: [
		{
			name: '$transaction',
			label: 'transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MoneroTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'outputIndex',
			label: 'output index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'publicKey',
			label: 'public key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'commitment',
			label: 'commitment',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
