// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import RedditSubredditSchema from '$/schema/RedditSubreddit.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.name)))
		error(404, 'Route mapping not applicable')

	const redditSubredditNameSelector = parseRouteEntitySelector(
		schema,
		RedditSubredditSchema,
		{
			name: decodeURIComponent(params.name),
		},
		'Name'
	)
	if (redditSubredditNameSelector instanceof arktype.errors)
		error(404, 'Invalid RedditSubreddit selector')

	return {
		selector: redditSubredditNameSelector,
	}
}
