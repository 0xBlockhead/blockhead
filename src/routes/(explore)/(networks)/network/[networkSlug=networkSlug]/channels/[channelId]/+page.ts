// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import LightningChannelSchema from '$/schema/LightningChannel.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const lightningChannelSelector = parseEntitySelector(
		schema,
		LightningChannelSchema,
		{
			$network: {
				slug: params.networkSlug,
			},
			channelId: params.channelId,
		}
	)
	if (lightningChannelSelector instanceof arktype.errors) error(404, 'Invalid LightningChannel selector')

	return {
		selector: lightningChannelSelector,
	}
}
