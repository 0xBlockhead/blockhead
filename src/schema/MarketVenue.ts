import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum MarketVenueSelector {
	MarketVenueId = 'marketVenueId',
}
export default {
	entityType: EntityType.MarketVenue,
	label: 'market venue',
	labelPlural: 'market venues',
	description: 'A curated exchange or venue identifier used to group markets.',
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
			label: 'market venue ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'label',
			label: 'Label',
			description: 'A human-readable name for the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$markets',
			label: 'markets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
