// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import YoutubeVideoSchema from '$/schema/YoutubeVideo.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const youtubeVideoSelector = parseEntitySelector(
		schema,
		YoutubeVideoSchema,
		{
			videoId: decodeURIComponent(params.videoId),
		}
	)
	if (youtubeVideoSelector instanceof arktype.errors) error(404, 'Invalid YoutubeVideo selector')

	return {
		selector: youtubeVideoSelector,
	}
}
