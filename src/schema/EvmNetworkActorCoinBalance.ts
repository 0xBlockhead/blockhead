// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$contract: {
		label: 'Contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$coinInstance: {
		label: 'Coin',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.One,
	},
	symbol: {
		label: 'Symbol',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	decimals: {
		label: 'Decimals',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmNetworkActorCoinBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blocks: {
		label: 'Blocks',
		type: EntityFieldType.EntitiesReference,
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
