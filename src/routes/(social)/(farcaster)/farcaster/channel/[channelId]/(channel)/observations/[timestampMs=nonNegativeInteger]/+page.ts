// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import FarcasterChannel_TimestampSchema from '$/schema/FarcasterChannel_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const farcasterChannelTimestampSelector = parseEntitySelector(
		schema,
		FarcasterChannel_TimestampSchema,
		{
			$channel: {
				id: decodeURIComponent(params.channelId),
			},
			timestampMs: Number(params.timestampMs),
		}
	)
	if (farcasterChannelTimestampSelector instanceof arktype.errors) error(404, 'Invalid FarcasterChannel_Timestamp selector')

	return {
		selector: farcasterChannelTimestampSelector,
	}
}
