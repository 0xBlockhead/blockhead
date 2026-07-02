// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import XUser_TimestampSchema from '$/schema/XUser_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const xUserTimestampSelector = parseEntitySelector(
		schema,
		XUser_TimestampSchema,
		{
			$user: {
				id: decodeURIComponent(params.userId),
			},
			timestampMs: Number(params.timestampMs),
		}
	)
	if (xUserTimestampSelector instanceof arktype.errors) error(404, 'Invalid XUser_Timestamp selector')

	return {
		selector: xUserTimestampSelector,
	}
}
