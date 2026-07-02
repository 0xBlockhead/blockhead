// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import YoutubePlaylist_TimestampSchema from '$/schema/YoutubePlaylist_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const youtubePlaylistTimestampSelector = parseEntitySelector(
		schema,
		YoutubePlaylist_TimestampSchema,
		{
			$playlist: {
				playlistId: decodeURIComponent(params.playlistId),
			},
			timestampMs: Number(params.timestampMs),
		}
	)
	if (youtubePlaylistTimestampSelector instanceof arktype.errors) error(404, 'Invalid YoutubePlaylist_Timestamp selector')

	return {
		selector: youtubePlaylistTimestampSelector,
	}
}
