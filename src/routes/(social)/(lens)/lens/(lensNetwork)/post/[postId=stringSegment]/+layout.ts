// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import LensPostSchema from '$/schema/LensPost.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.postId))) error(404, 'Route mapping not applicable')

	const lensPostIdSelector = parseEntitySelector(
		schema,
		LensPostSchema,
		{
			id: params.postId,
		}
	)
	if (lensPostIdSelector instanceof arktype.errors) error(404, 'Invalid LensPost selector')

	return {
		selector: lensPostIdSelector,
	}
}
