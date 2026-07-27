// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchRssItemIdentityKind } from '$/params/rssItemIdentityKind.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import RssItemSchema from '$/schema/RssItem.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchRssItemIdentityKind(params.itemIdentityKind) && matchStringSegment(params.itemIdentity))) error(404, 'Route mapping not applicable')

	const rssItemFeedIdentitySelector = parseEntitySelector(
		schema,
		RssItemSchema,
		{
			$feed: parentData.selector,
			itemIdentityKind: params.itemIdentityKind,
			itemIdentity: decodeURIComponent(params.itemIdentity),
		}
	)
	if (rssItemFeedIdentitySelector instanceof arktype.errors) error(404, 'Invalid RssItem selector')

	return {
		selector: rssItemFeedIdentitySelector,
	}
}
