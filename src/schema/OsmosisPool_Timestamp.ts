// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.OsmosisPool_Timestamp,
	labels: {
		singular: 'Osmosis pool timestamp',
		plural: 'Osmosis pool observations',
	},
	description: 'A point-in-time Osmosis poolmanager spot price for a base/quote denom pair.',
})({
	$pool: {
		entityType: EntityType.OsmosisPool,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	baseAssetDenom: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	quoteAssetDenom: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	spotPrice: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		PoolTimestampMsBaseQuote: [
			'$pool',
			'timestampMs',
			'baseAssetDenom',
			'quoteAssetDenom',
		],
	},
})
