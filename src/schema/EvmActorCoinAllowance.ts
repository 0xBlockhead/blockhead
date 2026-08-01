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
		label: 'Owner',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$contract: {
		label: 'Token',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.One,
	},
	$actorCoin: {
		label: 'Balance',
		entityType: EntityType.EvmNetworkActorCoinBalance,
		cardinality: EntityFieldCardinality.One,
	},
	$spender: {
		label: 'Spender',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	interopAddress: {
		label: 'Interop address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$spenderContract: {
		label: 'Spender contract',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$blocks: {
		label: 'Blocks',
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
