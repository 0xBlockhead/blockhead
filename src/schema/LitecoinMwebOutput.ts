import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum LitecoinMwebOutputSelector {
	LitecoinMwebTransactionOutputIndex = 'litecoinMwebTransactionOutputIndex',
	TransactionOutputIndex = '$transaction+outputIndex',
}
export default {
	entityType: EntityType.LitecoinMwebOutput,
	label: 'litecoin MWEB output',
	labelPlural: 'litecoin MWEB outputs',
	selectors: [
		{
			name: LitecoinMwebOutputSelector.LitecoinMwebTransactionOutputIndex,
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
			entityType: EntityType.LitecoinMwebTransaction,
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
			name: 'commitment',
			label: 'commitment',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'senderPubkey',
			label: 'sender public key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$localOutputState',
			label: 'local output state',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadLitecoinMwebOutputState,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
