import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum EvmNetworkActorCoinBalanceSelector {
	EvmAccountNativeCoinInstance = 'evmAccountNativeCoinInstance',
	ActorNetwork = '$actor+$network',
	EvmAccountErc20CoinInstance = 'evmAccountErc20CoinInstance',
	ActorContract = '$actor+$contract',
}
export default {
	entityType: EntityType.EvmNetworkActorCoinBalance,
	label: 'EVM network actor coin balance',
	labelPlural: 'EVM network actor coin balances',
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
			label: 'actor',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$contract',
			label: 'contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$coinInstance',
			label: 'coin instance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmCoinInstance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'symbol',
			label: 'Symbol',
			description: 'The short ticker or symbol used for display.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'decimals',
			label: 'Decimals',
			description: 'The number of decimal places used to display the amount.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmNetworkActorCoinBalance_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$blocks',
			label: 'blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmNetworkActorCoinBalance_EvmBlock,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
