// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$contract: {
		label: 'Token',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.One,
	},
	$actorCoin: {
		label: 'Balance',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmNetworkActorCoinBalance,
		cardinality: EntityFieldCardinality.One,
	},
	$spender: {
		label: 'Spender',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	interopAddress: {
		label: 'Interop address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$spenderContract: {
		label: 'Spender contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$blocks: {
		label: 'Blocks',
		type: EntityFieldType.EntitiesReference,
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
