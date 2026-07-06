// Generated from APP.ts. Do not edit by hand.

import { MarketVenueId } from '$/constants/MarketVenue.ts'
import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum MarketVenueSelector {
	MarketVenueId = 'MarketVenueId',
}
export default {
	entityType: EntityType.MarketVenue,
	label: 'Market venue',
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
			label: 'Market venue ID',
			type: EntityFieldType.Primitive,
			primitiveType: type.enumerated(...Object.values(MarketVenueId)),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'label',
			label: 'Label',
			description: 'A human-readable name for the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$markets',
			label: 'Markets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
