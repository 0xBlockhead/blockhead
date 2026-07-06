// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EvmNetworkActorCoinBalanceSelector {
	EvmAccountNativeCoinInstance = 'EvmAccountNativeCoinInstance',
	EvmAccountErc20CoinInstance = 'EvmAccountErc20CoinInstance',
}
export default {
	entityType: EntityType.EvmNetworkActorCoinBalance,
	label: 'balance',
	labelPlural: 'balances',
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
			label: 'Actor',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$network',
			label: 'Network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$contract',
			label: 'Contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$coinInstance',
			label: 'Coin',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmCoinInstance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'symbol',
			label: 'Symbol',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'decimals',
			label: 'Decimals',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmNetworkActorCoinBalance_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$blocks',
			label: 'Blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmNetworkActorCoinBalance_EvmBlock,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
