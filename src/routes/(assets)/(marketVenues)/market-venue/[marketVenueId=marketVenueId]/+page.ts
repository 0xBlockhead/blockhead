// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import MarketVenueSchema from '$/schema/MarketVenue.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const marketVenueSelector = parseEntitySelector(
		schema,
		MarketVenueSchema,
		{
			marketVenueId: params.marketVenueId,
		}
	)
	if (marketVenueSelector instanceof arktype.errors) error(404, 'Invalid MarketVenue selector')

	return {
		selector: marketVenueSelector,
	}
}
