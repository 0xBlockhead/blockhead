// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EvmNetworkActorCoinBalance_EvmBlockSelector {
	EvmNetworkActorCoinBalanceEvmBlock = 'EvmNetworkActorCoinBalanceEvmBlock',
}
export default {
	entityType: EntityType.EvmNetworkActorCoinBalance_EvmBlock,
	label: 'EVM network actor coin balance EVM block',
	labelPlural: 'EVM network actor coin balance EVM blocks',
	selectors: [
		{
			name: EvmNetworkActorCoinBalance_EvmBlockSelector.EvmNetworkActorCoinBalanceEvmBlock,
			fields: [
				'$actorCoin',
				'$block',
			],
		},
	],
	fields: [
		{
				name: '$actorCoin',
				label: 'Actor coin',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetworkActorCoinBalance,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$block',
				label: 'Block',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmBlock,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'balance',
				label: 'Balance',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'usdValue',
				label: 'USD value',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
