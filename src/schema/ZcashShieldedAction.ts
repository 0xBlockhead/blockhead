// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ZcashShieldedActionKind {
	Spend = 'spend',
	Output = 'output',
	Action = 'action',
}
export enum ZcashShieldedActionSelector {
	TransactionPoolActionKindIndexInTransaction = 'TransactionPoolActionKindIndexInTransaction',
}
export default {
	entityType: EntityType.ZcashShieldedAction,
	label: 'Zcash shielded action',
	labelPlural: 'Zcash shielded actions',
	selectors: [
		{
			name: ZcashShieldedActionSelector.TransactionPoolActionKindIndexInTransaction,
			fields: [
				'$transaction',
				'pool',
				'actionKind',
				'indexInTransaction',
			],
		},
	],
	fields: [
		{
			name: '$transaction',
			label: 'Transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'pool',
			label: 'Pool',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'actionKind',
			label: 'Action kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'indexInTransaction',
			label: 'Index in transaction',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$pool',
			label: 'Pool',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZcashShieldedPool,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'nullifier',
			label: 'Nullifier',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'noteCommitment',
			label: 'Note commitment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'valueCommitment',
			label: 'Value commitment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
