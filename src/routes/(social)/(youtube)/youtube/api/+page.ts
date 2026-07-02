// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import YoutubeNetworkSchema from '$/schema/YoutubeNetwork.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const youtubeNetworkSelector = parseEntitySelector(
		schema,
		YoutubeNetworkSchema,
		{
			scope: 'YoutubeNetwork',
		}
	)
	if (youtubeNetworkSelector instanceof arktype.errors) error(404, 'Invalid YoutubeNetwork selector')

	return {
		selector: youtubeNetworkSelector,
	}
}
