import { type } from 'arktype'
import EvmNetworkActorCoinBalance from '$/schema/EvmNetworkActorCoinBalance.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import EvmBlock from '$/schema/EvmBlock.ts'

export enum EvmNetworkActorCoinBalance_EvmBlockSelector {
	EvmNetworkActorCoinBalanceEvmBlock = 'evmNetworkActorCoinBalanceEvmBlock',
}

export default {
	entityType: EntityType.EvmNetworkActorCoinBalance_EvmBlock,

	label: 'Actor Coin EVM Block',
	labelPlural: 'Actor Coin EVM Blocks',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetworkActorCoinBalance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmBlock,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'balance',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'usdValue',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
