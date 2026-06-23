import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum ZcashShieldedActionKind {
	Spend = 'spend',
	Output = 'output',
	Action = 'action',
}
export enum ZcashShieldedActionSelector {
	UtxoTransactionPoolActionKindActionIndex = 'utxoTransactionPoolActionKindActionIndex',
	TransactionPoolActionKindActionIndex = '$transaction+pool+actionKind+actionIndex',
}
export default {
	entityType: EntityType.ZcashShieldedAction,
	label: 'zcash shielded action',
	labelPlural: 'zcash shielded actions',
	selectors: [
		{
			name: ZcashShieldedActionSelector.UtxoTransactionPoolActionKindActionIndex,
			fields: [
				'$transaction',
				'pool',
				'actionKind',
				'actionIndex',
			],
		},
	],
	fields: [
		{
			name: '$transaction',
			label: 'transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'pool',
			label: 'pool',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'actionKind',
			label: 'action kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'actionIndex',
			label: 'action index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$pool',
			label: 'pool',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZcashShieldedPool,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'nullifier',
			label: 'nullifier',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'noteCommitment',
			label: 'note commitment',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'valueCommitment',
			label: 'value commitment',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
