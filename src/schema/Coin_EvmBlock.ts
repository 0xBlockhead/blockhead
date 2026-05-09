import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Coin from '$/schema/Coin.ts'
import EvmBlock from '$/schema/EvmBlock.ts'

export default {
	entityType: EntityType.Coin_EvmBlock,

	label: 'Coin EVM Block',
	labelPlural: 'Coin EVM Blocks',

	id: type({
		$coin: Coin.id,
		$block: EvmBlock.id,
	}),

	fields: [
		{
			name: 'price',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'marketCap',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'totalSupply',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
