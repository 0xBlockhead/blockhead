// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { RedditComment as RedditCommentSchema } from '$/schema/RedditComment.ts'
import { type as arktype } from 'arktype'

// Route surface eligibility: requiredProjections=[]
export const load: LayoutLoad = ({ params }) => {
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
