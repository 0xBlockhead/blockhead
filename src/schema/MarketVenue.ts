// Generated from APP.ts.

import { MarketVenueId } from '$/constants/MarketVenue.ts'
import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.MarketVenue,
	labels: {
		singular: 'Market venue',
		plural: 'market venues',
	},
	description: 'A curated exchange or venue identifier used to group markets.',
})({
	marketVenueId: {
		primitiveType: type.enumerated(...Object.values(MarketVenueId)),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$markets: {
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
})({
	selectors: {
		MarketVenueId: [
			'marketVenueId',
		],
	},
})
