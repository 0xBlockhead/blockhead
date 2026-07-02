// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import AtprotoPost_TimestampSchema from '$/schema/AtprotoPost_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const atprotoPostTimestampSelector = parseEntitySelector(
		schema,
		AtprotoPost_TimestampSchema,
		{
			$post: {
				uri: decodeURIComponent(params.uri),
			},
			timestampMs: Number(params.timestampMs),
		}
	)
	if (atprotoPostTimestampSelector instanceof arktype.errors) error(404, 'Invalid AtprotoPost_Timestamp selector')

	return {
		selector: atprotoPostTimestampSelector,
	}
}
