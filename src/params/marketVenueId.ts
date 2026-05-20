import type { ParamMatcher } from '@sveltejs/kit'

import { MarketVenueId } from '$/constants/MarketVenue.ts'


export const match: ParamMatcher = (param) => (
	Object.values(MarketVenueId).includes(param as MarketVenueId)
)
