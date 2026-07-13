// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { RssItem as RssItemSchema } from '$/schema/RssItem.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.feedKey) && matchStringSegment(params.guid))) error(404, 'Route mapping not applicable')

	const rssItemFeedUrlGuidSelector = parseEntitySelector(
		schema,
		RssItemSchema,
		{
			feedUrl: params.feedKey,
			guid: params.guid,
		}
	)
	if (rssItemFeedUrlGuidSelector instanceof arktype.errors) error(404, 'Invalid RssItem selector')

	return {
		selector: rssItemFeedUrlGuidSelector,
	}
}
