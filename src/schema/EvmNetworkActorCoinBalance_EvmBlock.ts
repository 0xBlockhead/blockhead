import { type } from 'arktype'
import EvmNetworkActorCoinBalance from '$/schema/EvmNetworkActorCoinBalance.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import EvmBlock from '$/schema/EvmBlock.ts'

export default {
	entityType: EntityType.EvmNetworkActorCoinBalance_EvmBlock,

	label: 'Actor Coin EVM Block',
	labelPlural: 'Actor Coin EVM Blocks',

	id: type({
		$actorCoin: EvmNetworkActorCoinBalance.id,
		$block: EvmBlock.id,
	}),

	fields: [
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
