// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import FarcasterChannelSchema from '$/schema/FarcasterChannel.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const farcasterChannelSelector = parseEntitySelector(
		schema,
		FarcasterChannelSchema,
		{
			id: decodeURIComponent(params.channelId),
		}
	)
	if (farcasterChannelSelector instanceof arktype.errors) error(404, 'Invalid FarcasterChannel selector')

	return {
		selector: farcasterChannelSelector,
	}
}
