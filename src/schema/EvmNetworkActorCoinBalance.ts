// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmNetworkActorCoinBalance,
	labels: {
		singular: 'balance',
		plural: 'balances',
	},
})({
	$actor: {
		label: 'Actor',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$contract: {
		label: 'Contract',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$coinInstance: {
		label: 'Coin',
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.One,
	},
	symbol: {
		label: 'Symbol',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	decimals: {
		label: 'Decimals',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'Observations',
		entityType: EntityType.EvmNetworkActorCoinBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blocks: {
		label: 'Blocks',
		entityType: EntityType.EvmNetworkActorCoinBalance_EvmBlock,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		EvmAccountNativeCoinInstance: [
			'$actor',
			'$network',
		],
		EvmAccountErc20CoinInstance: [
			'$actor',
			'$contract',
		],
	},
})
