import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Transaction from '$/schema/UtxoTransaction.ts'
import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPool.ts'

export enum ZcashShieldedActionKind {
	Spend = 'spend',
	Output = 'output',
	Action = 'action',
}

export default {
	entityType: EntityType.ZcashShieldedAction,

	label: 'Zcash Sapling/Orchard Action',
	labelPlural: 'Zcash Sapling/Orchard Actions',

	id: type({
		$transaction: Transaction.id,
		pool: type.valueOf(ZcashShieldedPoolKind),
		actionKind: type.valueOf(ZcashShieldedActionKind),
		actionIndex: 'number',
	}),

	fields: [
		{
			name: '$pool',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZcashShieldedPool,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'actionKind',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(ZcashShieldedActionKind),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'nullifier',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'noteCommitment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'valueCommitment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
