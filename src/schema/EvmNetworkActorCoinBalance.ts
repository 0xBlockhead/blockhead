import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum EvmNetworkActorCoinBalanceSelector {
	EvmAccountEvmCoinInstance = 'evmAccountEvmCoinInstance',
}

export default {
	entityType: EntityType.EvmNetworkActorCoinBalance,

	label: 'Balance',
	labelPlural: 'Balances',

	selectors: [
		{
			name: EvmNetworkActorCoinBalanceSelector.EvmAccountEvmCoinInstance,
			fields: [
				'$actor',
				'$coinInstance',
			],
		},
	],

	fields: [
		{
			name: '$actor',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$coinInstance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmCoinInstance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'symbol',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'decimals',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'balance',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'usdValue',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
