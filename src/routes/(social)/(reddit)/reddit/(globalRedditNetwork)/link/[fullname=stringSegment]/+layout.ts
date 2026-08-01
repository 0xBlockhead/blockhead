// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import RedditLinkSchema from '$/schema/RedditLink.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.fullname)))
		error(404, 'Route mapping not applicable')

	const redditLinkFullnameSelector = parseEntitySelector(
		schema,
		RedditLinkSchema,
		{
			fullname: decodeURIComponent(params.fullname),
		},
		'Fullname'
	)
	if (redditLinkFullnameSelector instanceof arktype.errors)
		error(404, 'Invalid RedditLink selector')

	return {
		selector: redditLinkFullnameSelector,
	}
}
