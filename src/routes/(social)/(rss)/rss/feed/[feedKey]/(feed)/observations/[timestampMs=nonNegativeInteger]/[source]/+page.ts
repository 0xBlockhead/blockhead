// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import RssFeed_TimestampSchema from '$/schema/RssFeed_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const rssFeedTimestampSelector = parseEntitySelector(
		schema,
		RssFeed_TimestampSchema,
		{
			$feed: {
				feedUrl: decodeURIComponent(params.feedKey),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (rssFeedTimestampSelector instanceof arktype.errors) error(404, 'Invalid RssFeed_Timestamp selector')

	return {
		selector: rssFeedTimestampSelector,
	}
}
