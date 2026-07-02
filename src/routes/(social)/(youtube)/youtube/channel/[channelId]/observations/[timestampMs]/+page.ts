// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import YoutubeChannel_TimestampSchema from '$/schema/YoutubeChannel_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const youtubeChannelTimestampSelector = parseEntitySelector(
		schema,
		YoutubeChannel_TimestampSchema,
		{
			$channel: {
				channelId: decodeURIComponent(params.channelId),
			},
			timestampMs: Number(params.timestampMs),
		}
	)
	if (youtubeChannelTimestampSelector instanceof arktype.errors) error(404, 'Invalid YoutubeChannel_Timestamp selector')

	return {
		selector: youtubeChannelTimestampSelector,
	}
}
