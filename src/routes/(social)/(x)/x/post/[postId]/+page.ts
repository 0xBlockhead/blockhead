// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import XPostSchema from '$/schema/XPost.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const xPostSelector = parseEntitySelector(
		schema,
		XPostSchema,
		{
			id: decodeURIComponent(params.postId),
		}
	)
	if (xPostSelector instanceof arktype.errors) error(404, 'Invalid XPost selector')

	return {
		selector: xPostSelector,
	}
}
