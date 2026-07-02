// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import FarcasterUser_TimestampSchema from '$/schema/FarcasterUser_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const farcasterUserTimestampSelector = parseEntitySelector(
		schema,
		FarcasterUser_TimestampSchema,
		{
			$user: {
				fid: Number(params.userId),
			},
			timestampMs: Number(params.timestampMs),
		}
	)
	if (farcasterUserTimestampSelector instanceof arktype.errors) error(404, 'Invalid FarcasterUser_Timestamp selector')

	return {
		selector: farcasterUserTimestampSelector,
	}
}
