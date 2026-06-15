import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum EvmNetworkActorCoinBalanceSelector {
	EvmAccountNativeCoinInstance = 'evmAccountNativeCoinInstance',
	EvmAccountErc20CoinInstance = 'evmAccountErc20CoinInstance',
}

export default {
	entityType: EntityType.EvmNetworkActorCoinBalance,

	label: 'Balance',
	labelPlural: 'Balances',

	selectors: [
		{
			name: EvmNetworkActorCoinBalanceSelector.EvmAccountNativeCoinInstance,
			fields: [
				'$actor',
				'$network',
			],
		},
		{
			name: EvmNetworkActorCoinBalanceSelector.EvmAccountErc20CoinInstance,
			fields: [
				'$actor',
				'$contract',
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
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
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
