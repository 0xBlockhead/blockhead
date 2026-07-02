// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import YoutubeChannelSchema from '$/schema/YoutubeChannel.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const youtubeChannelSelector = parseEntitySelector(
		schema,
		YoutubeChannelSchema,
		{
			channelId: decodeURIComponent(params.channelId),
		}
	)
	if (youtubeChannelSelector instanceof arktype.errors) error(404, 'Invalid YoutubeChannel selector')

	return {
		selector: youtubeChannelSelector,
	}
}
