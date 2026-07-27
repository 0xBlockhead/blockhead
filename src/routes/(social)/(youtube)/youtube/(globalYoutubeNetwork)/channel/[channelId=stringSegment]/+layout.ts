// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import YoutubeChannelSchema from '$/schema/YoutubeChannel.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.channelId))) error(404, 'Route mapping not applicable')

	const youtubeChannelChannelIdSelector = parseEntitySelector(
		schema,
		YoutubeChannelSchema,
		{
			channelId: decodeURIComponent(params.channelId),
		}
	)
	if (youtubeChannelChannelIdSelector instanceof arktype.errors) error(404, 'Invalid YoutubeChannel selector')

	return {
		selector: youtubeChannelChannelIdSelector,
	}
}
