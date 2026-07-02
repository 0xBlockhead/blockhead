// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import RedditComment_TimestampSchema from '$/schema/RedditComment_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const redditCommentTimestampSelector = parseEntitySelector(
		schema,
		RedditComment_TimestampSchema,
		{
			$comment: {
				fullname: decodeURIComponent(params.fullname),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (redditCommentTimestampSelector instanceof arktype.errors) error(404, 'Invalid RedditComment_Timestamp selector')

	return {
		selector: redditCommentTimestampSelector,
	}
}
