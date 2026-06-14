import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Coin from '$/schema/Coin.ts'
import EvmBlock from '$/schema/EvmBlock.ts'

export enum Coin_EvmBlockSelector {
	CoinEvmBlock = 'coinEvmBlock',
}

export default {
	entityType: EntityType.Coin_EvmBlock,

	label: 'Coin EVM Block',
	labelPlural: 'Coin EVM Blocks',

	selectors: [
		{
			name: Coin_EvmBlockSelector.CoinEvmBlock,
			fields: [
				'$coin',
				'$block',
			],
		},
	],

	fields: [
		{
			name: '$coin',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Coin,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmBlock,
			cardinality: EntityFieldCardinality.One,
		},
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
