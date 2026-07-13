// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { YoutubePlaylist as YoutubePlaylistSchema } from '$/schema/YoutubePlaylist.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.playlistId))) error(404, 'Route mapping not applicable')

	const youtubePlaylistPlaylistIdSelector = parseEntitySelector(
		schema,
		YoutubePlaylistSchema,
		{
			playlistId: params.playlistId,
		}
	)
	if (youtubePlaylistPlaylistIdSelector instanceof arktype.errors) error(404, 'Invalid YoutubePlaylist selector')

	return {
		selector: youtubePlaylistPlaylistIdSelector,
	}
}
