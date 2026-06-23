import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BeaconWithdrawalSelector {
	EvmNetworkSlotIndex = 'evmNetworkSlotIndex',
	NetworkSlotIndex = '$network+slot+index',
}
export default {
	entityType: EntityType.BeaconWithdrawal,
	label: 'beacon withdrawal',
	labelPlural: 'beacon withdrawals',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'slot',
			label: 'slot',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'index',
			label: 'index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'validatorIndex',
			label: 'validator index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$validator',
			label: 'validator',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BeaconValidator,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$account',
			label: 'account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'amountGwei',
			label: 'amount gwei',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
