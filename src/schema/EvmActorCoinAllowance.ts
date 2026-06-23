import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum EvmActorCoinAllowanceSelector {
	EvmAccountEvmContractSpenderInteropAddress = 'evmAccountEvmContractSpenderInteropAddress',
	ActorContractSpenderInteropAddress = '$actor+$contract+$spender+interopAddress',
}
export default {
	entityType: EntityType.EvmActorCoinAllowance,
	label: 'EVM actor coin allowance',
	labelPlural: 'EVM actor coin allowances',
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
			label: 'actor',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$contract',
			label: 'contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$actorCoin',
			label: 'actor coin',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetworkActorCoinBalance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$spender',
			label: 'spender',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'interopAddress',
			label: 'interop address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$spenderContract',
			label: 'spender contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$blocks',
			label: 'blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmActorCoinAllowance_Block,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
