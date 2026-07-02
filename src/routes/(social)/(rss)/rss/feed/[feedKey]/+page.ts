// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import RssFeedSchema from '$/schema/RssFeed.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const rssFeedSelector = parseEntitySelector(
		schema,
		RssFeedSchema,
		{
			feedUrl: decodeURIComponent(params.feedKey),
		}
	)
	if (rssFeedSelector instanceof arktype.errors) error(404, 'Invalid RssFeed selector')

	return {
		selector: rssFeedSelector,
	}
}
