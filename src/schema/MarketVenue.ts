import { type } from 'arktype'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export enum MarketVenueSelector {
	MarketVenueId = 'marketVenueId',
}



export default {
	entityType: EntityType.MarketVenue,

	label: 'Market venue',
	labelPlural: 'Market venues',

	selectors: [
		{
			name: MarketVenueSelector.MarketVenueId,
			fields: [
				'marketVenueId',
			],
		},
	],

	fields: [
		{
			name: 'marketVenueId',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(MarketVenueId),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'label',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$$markets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.Coingecko_OpenApi,
				Source.Coinpaprika_OpenApi,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
