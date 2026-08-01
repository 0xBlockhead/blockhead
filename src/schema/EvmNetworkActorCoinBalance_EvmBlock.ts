// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmNetworkActorCoinBalance_EvmBlock,
	labels: {
		singular: 'EVM network actor coin balance EVM block',
		plural: 'EVM network actor coin balance EVM blocks',
	},
})({
	$actorCoin: {
		entityType: EntityType.EvmNetworkActorCoinBalance,
		cardinality: EntityFieldCardinality.One,
	},
	$block: {
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.One,
	},
	balance: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	usdValue: {
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
