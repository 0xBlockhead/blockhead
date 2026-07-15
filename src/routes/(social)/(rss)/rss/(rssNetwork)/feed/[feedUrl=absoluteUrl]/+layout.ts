// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchAbsoluteUrl } from '$/params/absoluteUrl.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { RssFeed as RssFeedSchema } from '$/schema/RssFeed.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchAbsoluteUrl(params.feedUrl))) error(404, 'Route mapping not applicable')

	const rssFeedFeedUrlSelector = parseEntitySelector(
		schema,
		RssFeedSchema,
		{
			feedUrl: decodeURIComponent(params.feedUrl),
		}
	)
	if (rssFeedFeedUrlSelector instanceof arktype.errors) error(404, 'Invalid RssFeed selector')

	return {
		selector: rssFeedFeedUrlSelector,
	}
}
