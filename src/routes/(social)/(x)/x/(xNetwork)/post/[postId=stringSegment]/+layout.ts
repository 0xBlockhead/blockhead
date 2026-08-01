// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import XPostSchema from '$/schema/XPost.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.postId)))
		error(404, 'Route mapping not applicable')

	const xPostIdSelector = parseEntitySelector(
		schema,
		XPostSchema,
		{
			id: params.postId,
		},
		'Id'
	)
	if (xPostIdSelector instanceof arktype.errors)
		error(404, 'Invalid XPost selector')

	return {
		selector: xPostIdSelector,
	}
}
