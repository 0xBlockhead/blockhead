// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EvmActorCoinAllowanceSelector {
	EvmAccountEvmContractSpenderInteropAddress = 'EvmAccountEvmContractSpenderInteropAddress',
}
export default {
	entityType: EntityType.EvmActorCoinAllowance,
	label: 'allowance',
	labelPlural: 'allowances',
	selectors: [
		{
			name: EvmActorCoinAllowanceSelector.EvmAccountEvmContractSpenderInteropAddress,
			fields: [
				'$actor',
				'$contract',
				'$spender',
				'interopAddress',
			],
		},
	],
	fields: [
		{
				name: '$actor',
				label: 'Owner',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$contract',
				label: 'Token',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmContract,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$actorCoin',
				label: 'Balance',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetworkActorCoinBalance,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$spender',
				label: 'Spender',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'interopAddress',
				label: 'Interop address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$spenderContract',
				label: 'Spender contract',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmContract,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$blocks',
				label: 'Blocks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EvmActorCoinAllowance_Block,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
