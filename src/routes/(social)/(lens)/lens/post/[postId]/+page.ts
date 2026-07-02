// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import LensPostSchema from '$/schema/LensPost.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const lensPostSelector = parseEntitySelector(
		schema,
		LensPostSchema,
		{
			id: decodeURIComponent(params.postId),
		}
	)
	if (lensPostSelector instanceof arktype.errors) error(404, 'Invalid LensPost selector')

	return {
		selector: lensPostSelector,
	}
}
