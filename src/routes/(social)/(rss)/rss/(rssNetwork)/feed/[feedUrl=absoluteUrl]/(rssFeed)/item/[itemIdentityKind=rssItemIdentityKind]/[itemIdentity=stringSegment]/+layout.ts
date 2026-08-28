// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchRssItemIdentityKind } from '$/params/rssItemIdentityKind.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import RssFeedSchema from '$/schema/RssFeed.ts'
import RssItemSchema from '$/schema/RssItem.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchRssItemIdentityKind(params.itemIdentityKind) && matchStringSegment(params.itemIdentity)))
		error(404, 'Route mapping not applicable')

	const rssFeedFeedUrlParentSelector = parseRouteEntitySelector(
		schema,
		RssFeedSchema,
		parentData.selector,
		'FeedUrl'
	)
	if (rssFeedFeedUrlParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const rssItemFeedIdentitySelector = parseRouteEntitySelector(
		schema,
		RssItemSchema,
		{
			$feed: rssFeedFeedUrlParentSelector,
			itemIdentityKind: params.itemIdentityKind,
			itemIdentity: decodeURIComponent(params.itemIdentity),
		},
		'FeedIdentity'
	)
	if (rssItemFeedIdentitySelector instanceof arktype.errors)
		error(404, 'Invalid RssItem selector')

	return {
		selector: rssItemFeedIdentitySelector,
	}
}
