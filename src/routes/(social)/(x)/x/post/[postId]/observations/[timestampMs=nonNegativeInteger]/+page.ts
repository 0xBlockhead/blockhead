// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import XPost_TimestampSchema from '$/schema/XPost_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const xPostTimestampSelector = parseEntitySelector(
		schema,
		XPost_TimestampSchema,
		{
			$post: {
				id: decodeURIComponent(params.postId),
			},
			timestampMs: Number(params.timestampMs),
		}
	)
	if (xPostTimestampSelector instanceof arktype.errors) error(404, 'Invalid XPost_Timestamp selector')

	return {
		selector: xPostTimestampSelector,
	}
}
