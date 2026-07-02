// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import YoutubeVideo_TimestampSchema from '$/schema/YoutubeVideo_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const youtubeVideoTimestampSelector = parseEntitySelector(
		schema,
		YoutubeVideo_TimestampSchema,
		{
			$video: {
				videoId: decodeURIComponent(params.videoId),
			},
			timestampMs: Number(params.timestampMs),
		}
	)
	if (youtubeVideoTimestampSelector instanceof arktype.errors) error(404, 'Invalid YoutubeVideo_Timestamp selector')

	return {
		selector: youtubeVideoTimestampSelector,
	}
}
