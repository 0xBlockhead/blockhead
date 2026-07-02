// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadStateChannelSchema from '$/schema/BlockheadStateChannel.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const blockheadStateChannelSelector = parseEntitySelector(
		schema,
		BlockheadStateChannelSchema,
		{
			id: decodeURIComponent(params.channelId),
		}
	)
	if (blockheadStateChannelSelector instanceof arktype.errors) error(404, 'Invalid BlockheadStateChannel selector')

	return {
		selector: blockheadStateChannelSelector,
	}
}
