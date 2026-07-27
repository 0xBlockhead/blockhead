// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import RedditCommentSchema from '$/schema/RedditComment.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.fullname))) error(404, 'Route mapping not applicable')

	const redditCommentFullnameSelector = parseEntitySelector(
		schema,
		RedditCommentSchema,
		{
			fullname: decodeURIComponent(params.fullname),
		}
	)
	if (redditCommentFullnameSelector instanceof arktype.errors) error(404, 'Invalid RedditComment selector')

	return {
		selector: redditCommentFullnameSelector,
	}
}
