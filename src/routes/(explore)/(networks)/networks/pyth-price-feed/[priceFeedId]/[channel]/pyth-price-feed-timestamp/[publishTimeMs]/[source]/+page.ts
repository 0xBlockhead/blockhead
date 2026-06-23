import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/PythPriceFeed_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$feed': {
				priceFeedId: decodeURIComponent(params.priceFeedId),
				channel: decodeURIComponent(params.channel),
			},
			publishTimeMs: decodeURIComponent(params.publishTimeMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid PythPriceFeed_Timestamp selector')

	return { selector }
}
