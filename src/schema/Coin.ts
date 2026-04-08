import { type } from 'arktype'
import { CoinId } from '$/constants/Coin.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Sources.ts'

export default {
	entityType: EntityType.Coin,

	label: 'Coin',
	labelPlural: 'Coins',

	id: type({
		coinId: type.valueOf(CoinId),
	}),

	fields: [
		{
			name: 'symbol',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'decimals',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$logo',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$coinInstances',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CoinInstance,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Coingecko],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
