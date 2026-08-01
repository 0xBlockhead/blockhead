// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmActorCoinAllowance,
	labels: {
		singular: 'allowance',
		plural: 'allowances',
	},
})({
	$actor: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$contract: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.One,
	},
	$actorCoin: {
		entityType: EntityType.EvmNetworkActorCoinBalance,
		cardinality: EntityFieldCardinality.One,
	},
	$spender: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	interopAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$spenderContract: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$blocks: {
		entityType: EntityType.EvmActorCoinAllowance_Block,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		EvmAccountEvmContractSpenderInteropAddress: [
			'$actor',
			'$contract',
			'$spender',
			'interopAddress',
		],
	},
})
