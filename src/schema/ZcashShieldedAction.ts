import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	conditionalOn,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPool.ts'

export enum ZcashShieldedActionSelector {
	UtxoTransactionPoolActionKindActionIndex = 'utxoTransactionPoolActionKindActionIndex',
}


export enum ZcashShieldedActionKind {
	Spend = 'spend',
	Output = 'output',
	Action = 'action',
}

const zcashShieldedActionKindField = {
	name: 'actionKind',
	type: EntityFieldType.Primitive,
	primitiveType: type.valueOf(ZcashShieldedActionKind),
	cardinality: EntityFieldCardinality.One,
} as const satisfies EntityFieldDefinition

export default {
	entityType: EntityType.ZcashShieldedAction,

	label: 'Zcash Sapling/Orchard Action',
	labelPlural: 'Zcash Sapling/Orchard Actions',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'pool',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(ZcashShieldedPoolKind),
			cardinality: EntityFieldCardinality.One,
		},
		zcashShieldedActionKindField,
		{
			name: 'actionIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$pool',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZcashShieldedPool,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'nullifier',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			when: conditionalOn(
				[zcashShieldedActionKindField],
				'actionKind',
				[
					ZcashShieldedActionKind.Spend,
					ZcashShieldedActionKind.Action,
				]
			),
		},
		{
			name: 'noteCommitment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			when: conditionalOn(
				[zcashShieldedActionKindField],
				'actionKind',
				[
					ZcashShieldedActionKind.Output,
					ZcashShieldedActionKind.Action,
				]
			),
		},
		{
			name: 'valueCommitment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
