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
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$contract: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$coinInstance: {
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.One,
	},
	symbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	decimals: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.EvmNetworkActorCoinBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blocks: {
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
