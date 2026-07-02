// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BeaconWithdrawalSelector {
	EvmNetworkSlotIndexInSlot = 'EvmNetworkSlotIndexInSlot',
}
export default {
	entityType: EntityType.BeaconWithdrawal,
	label: 'beacon withdrawal',
	labelPlural: 'Beacon withdrawals',
	selectors: [
		{
			name: BeaconWithdrawalSelector.EvmNetworkSlotIndexInSlot,
			fields: [
				'$network',
				'slot',
				'indexInSlot',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'slot',
				label: 'Slot',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'indexInSlot',
				label: 'Index in slot',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'validatorIndex',
				label: 'Validator index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$validator',
				label: 'Validator',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BeaconValidator,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$account',
				label: 'Account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'amountGwei',
				label: 'Amount',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
