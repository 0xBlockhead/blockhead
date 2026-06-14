import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export enum BeaconWithdrawalSelector {
	EvmNetworkSlotIndex = 'evmNetworkSlotIndex',
}

export default {
	entityType: EntityType.BeaconWithdrawal,

	label: 'Beacon withdrawal',
	labelPlural: 'Beacon withdrawals',

	selectors: [
		{
			name: BeaconWithdrawalSelector.EvmNetworkSlotIndex,
			fields: [
				'$network',
				'slot',
				'index',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'slot',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'validatorIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: '$validator',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BeaconValidator,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: '$account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'amountGwei',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
