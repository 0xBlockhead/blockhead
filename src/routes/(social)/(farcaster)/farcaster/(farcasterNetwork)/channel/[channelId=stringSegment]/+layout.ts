// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import FarcasterChannelSchema from '$/schema/FarcasterChannel.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.channelId)))
		error(404, 'Route mapping not applicable')

	const farcasterChannelIdSelector = parseEntitySelector(
		schema,
		FarcasterChannelSchema,
		{
			id: params.channelId,
		},
		'Id'
	)
	if (farcasterChannelIdSelector instanceof arktype.errors)
		error(404, 'Invalid FarcasterChannel selector')

	return {
		selector: farcasterChannelIdSelector,
	}
}
