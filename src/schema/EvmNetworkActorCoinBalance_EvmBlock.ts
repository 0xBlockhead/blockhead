// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EvmNetworkActorCoinBalance_EvmBlockSelector {
	EvmNetworkActorCoinBalanceEvmBlock = 'EvmNetworkActorCoinBalanceEvmBlock',
}
export const EvmNetworkActorCoinBalance_EvmBlock = entity({
	entityType: EntityType.EvmNetworkActorCoinBalance_EvmBlock,
	label: 'EVM network actor coin balance EVM block',
	labelPlural: 'EVM network actor coin balance EVM blocks',
})({
	$actorCoin: {
		label: 'Actor coin',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmNetworkActorCoinBalance,
		cardinality: EntityFieldCardinality.One,
	},
	$block: {
		label: 'Block',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.One,
	},
	balance: {
		label: 'Balance',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	usdValue: {
		label: 'USD value',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		EvmNetworkActorCoinBalanceEvmBlock: [
			'$actorCoin',
			'$block',
		],
	},
})
