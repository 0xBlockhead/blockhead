// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import RedditCommentSchema from '$/schema/RedditComment.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const redditCommentSelector = parseEntitySelector(
		schema,
		RedditCommentSchema,
		{
			fullname: decodeURIComponent(params.fullname),
		}
	)
	if (redditCommentSelector instanceof arktype.errors) error(404, 'Invalid RedditComment selector')

	return {
		selector: redditCommentSelector,
	}
}
