// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { YoutubeVideo as YoutubeVideoSchema } from '$/schema/YoutubeVideo.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.videoId))) error(404, 'Route mapping not applicable')

	const youtubeVideoVideoIdSelector = parseEntitySelector(
		schema,
		YoutubeVideoSchema,
		{
			videoId: params.videoId,
		}
	)
	if (youtubeVideoVideoIdSelector instanceof arktype.errors) error(404, 'Invalid YoutubeVideo selector')

	return {
		selector: youtubeVideoVideoIdSelector,
	}
}
