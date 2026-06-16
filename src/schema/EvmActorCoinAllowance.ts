import { type } from 'arktype'
import EvmNetworkActorCoinBalance from '$/schema/EvmNetworkActorCoinBalance.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export enum EvmActorCoinAllowanceSelector {
	EvmAccountEvmContractSpenderInteropAddress = 'evmAccountEvmContractSpenderInteropAddress',
}


// On-chain ERC-20 allowance (owner × token contract × spender). Voltaire reads allowance via eth_call when the composite id is known; discovery/list fields are not indexed yet.

export default {
	entityType: EntityType.EvmActorCoinAllowance,

	label: 'Coin Allowance',
	labelPlural: 'Coin Allowances',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$actorCoin',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetworkActorCoinBalance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$spender',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'interopAddress',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'allowance',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: 'lastChecked',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: '$spenderContract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

export const toEvmActorCoinAllowanceEntitySelector = (
	chainId: number,
	address: `0x${string}`,
	tokenContract: `0x${string}`,
	spenderAddress: `0x${string}`
): EntitySelector<typeof schema, EntityType.EvmActorCoinAllowance> => ({
	$actor: {
		address,
		interopAddress: address,
	},
	$contract: {
		$network: {
			caip2: {
				namespace: 'eip155' as const,
				reference: String(chainId),
			},
		},
		address: tokenContract,
	},
	$spender: {
		address: spenderAddress,
		interopAddress: spenderAddress,
	},
	interopAddress: spenderAddress,
})
