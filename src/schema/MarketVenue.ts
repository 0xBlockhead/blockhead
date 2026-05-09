import { type } from 'arktype'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'


export default {
	entityType: EntityType.MarketVenue,

	label: 'Market venue',
	labelPlural: 'Market venues',

	id: type({
		marketVenueId: type.valueOf(MarketVenueId),
	}),

	fields: [
		{
			name: 'label',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
