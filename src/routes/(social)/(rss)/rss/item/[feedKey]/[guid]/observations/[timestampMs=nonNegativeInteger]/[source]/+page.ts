// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import RssItem_TimestampSchema from '$/schema/RssItem_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const rssItemTimestampSelector = parseEntitySelector(
		schema,
		RssItem_TimestampSchema,
		{
			$item: {
				feedUrl: decodeURIComponent(params.feedKey),
				guid: decodeURIComponent(params.guid),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (rssItemTimestampSelector instanceof arktype.errors) error(404, 'Invalid RssItem_Timestamp selector')

	return {
		selector: rssItemTimestampSelector,
	}
}
