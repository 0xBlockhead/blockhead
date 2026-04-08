import { Source } from '$/sources/$Sources.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { type } from 'arktype'

export default {
	entityType: EntityType._Global,

	label: 'Global',
	labelPlural: 'Globals',

	id: type({}),

	fields: [
		{
			name: '$$networks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.ChainList, Source.Blockscout],
		},
		{
			name: '$$networkForks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NetworkFork,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source._Constants],
		},
		{
			name: '$$proposalsEips',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Proposal,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Eips],
		},
		{
			name: '$$proposalsErc',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Proposal,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Eips],
		},
		{
			name: '$$proposalsEnsip',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Proposal,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Ensips],
		},
		{
			name: '$$caips',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Caip,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Caips],
		},
		{
			name: '$$coins',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Coin,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source._Constants,
				Source.Coingecko,
				Source.CoinMarketCap,
				Source.Coinpaprika,
			],
		},
		{
			name: '$$coinPrices',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CoinPrice,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source._Constants,
				Source.Coingecko,
				Source.CoinMarketCap,
				Source.Coinpaprika,
			],
		},
		{
			name: 'duneCreditsUsed',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Dune],
		},
		{
			name: 'duneCreditsIncluded',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Dune],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
