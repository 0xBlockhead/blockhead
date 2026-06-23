import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/Market_TimeInterval_Timestamp.ts'
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
			timeInterval: decodeURIComponent(params.timeInterval),
			timestampMs: Number(params.timestampMs),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid Market_TimeInterval_Timestamp selector')

	return { selector }
}
