// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import RedditSubreddit_TimestampSchema from '$/schema/RedditSubreddit_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const redditSubredditTimestampSelector = parseEntitySelector(
		schema,
		RedditSubreddit_TimestampSchema,
		{
			$subreddit: {
				name: decodeURIComponent(params.name),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (redditSubredditTimestampSelector instanceof arktype.errors) error(404, 'Invalid RedditSubreddit_Timestamp selector')

	return {
		selector: redditSubredditTimestampSelector,
	}
}
