// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import YoutubePlaylistSchema from '$/schema/YoutubePlaylist.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.playlistId)))
		error(404, 'Route mapping not applicable')

	const youtubePlaylistPlaylistIdSelector = parseRouteEntitySelector(
		schema,
		YoutubePlaylistSchema,
		{
			playlistId: decodeURIComponent(params.playlistId),
		},
		'PlaylistId'
	)
	if (youtubePlaylistPlaylistIdSelector instanceof arktype.errors)
		error(404, 'Invalid YoutubePlaylist selector')

	return {
		selector: youtubePlaylistPlaylistIdSelector,
	}
}
