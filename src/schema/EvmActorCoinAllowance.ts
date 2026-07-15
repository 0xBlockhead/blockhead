// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EvmActorCoinAllowanceSelector {
	EvmAccountEvmContractSpenderInteropAddress = 'EvmAccountEvmContractSpenderInteropAddress',
}
export const EvmActorCoinAllowance = entity({
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
