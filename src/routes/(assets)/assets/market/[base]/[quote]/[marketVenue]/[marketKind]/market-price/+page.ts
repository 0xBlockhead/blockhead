import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/MarketPrice.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$market': {
				'$base': decodeURIComponent(params.base),
				'$quote': decodeURIComponent(params.quote),
				'$marketVenue': decodeURIComponent(params.marketVenue),
				marketKind: decodeURIComponent(params.marketKind),
			},
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid MarketPrice selector')

	return { selector }
}
