import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum EvmNetworkActorCoinBalance_EvmBlockSelector {
	EvmNetworkActorCoinBalanceEvmBlock = 'evmNetworkActorCoinBalanceEvmBlock',
	ActorCoinBlock = '$actorCoin+$block',
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
			label: 'actor coin',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetworkActorCoinBalance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$block',
			label: 'block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmBlock,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'balance',
			label: 'balance',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'usdValue',
			label: 'usd value',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
