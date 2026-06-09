import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldEntry,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import {
	conditionalFieldGroup,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Transaction from '$/schema/UtxoTransaction.ts'
import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPool.ts'

export enum ZcashShieldedActionKind {
	Spend = 'spend',
	Output = 'output',
	Action = 'action',
}

const zcashShieldedActionDiscriminatorFields = [
	{
		name: 'actionKind',
		type: EntityFieldType.Primitive,
		primitiveType: type.valueOf(ZcashShieldedActionKind),
		cardinality: EntityFieldCardinality.One,
	},
] as const satisfies readonly EntityFieldDefinition[]

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
		...zcashShieldedActionDiscriminatorFields,
		conditionalFieldGroup(
			zcashShieldedActionDiscriminatorFields,
			'actionKind',
			[
				ZcashShieldedActionKind.Spend,
				ZcashShieldedActionKind.Action,
			],
			[
				{
					name: 'nullifier',
					type: EntityFieldType.Primitive,
					primitiveType: type('string'),
					cardinality: EntityFieldCardinality.ZeroOrOne,
				},
			],
		),
		conditionalFieldGroup(
			zcashShieldedActionDiscriminatorFields,
			'actionKind',
			[
				ZcashShieldedActionKind.Output,
				ZcashShieldedActionKind.Action,
			],
			[
				{
					name: 'noteCommitment',
					type: EntityFieldType.Primitive,
					primitiveType: type('string'),
					cardinality: EntityFieldCardinality.ZeroOrOne,
				},
			],
		),
		{
			name: 'valueCommitment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldEntry[],
} as const satisfies EntityDefinition
