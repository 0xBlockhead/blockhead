// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import RedditLink_TimestampSchema from '$/schema/RedditLink_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const redditLinkTimestampSelector = parseEntitySelector(
		schema,
		RedditLink_TimestampSchema,
		{
			$link: {
				fullname: decodeURIComponent(params.fullname),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (redditLinkTimestampSelector instanceof arktype.errors) error(404, 'Invalid RedditLink_Timestamp selector')

	return {
		selector: redditLinkTimestampSelector,
	}
}
