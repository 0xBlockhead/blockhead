// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import RedditLinkSchema from '$/schema/RedditLink.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const redditLinkSelector = parseEntitySelector(
		schema,
		RedditLinkSchema,
		{
			fullname: decodeURIComponent(params.fullname),
		}
	)
	if (redditLinkSelector instanceof arktype.errors) error(404, 'Invalid RedditLink selector')

	return {
		selector: redditLinkSelector,
	}
}
