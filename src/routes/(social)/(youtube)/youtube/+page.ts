// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import _GlobalYoutubeNetworkSchema from '$/schema/_GlobalYoutubeNetwork.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const globalYoutubeNetworkSelector = parseEntitySelector(
		schema,
		_GlobalYoutubeNetworkSchema,
		{
			scope: '_GlobalYoutubeNetwork',
		}
	)
	if (globalYoutubeNetworkSelector instanceof arktype.errors) error(404, 'Invalid _GlobalYoutubeNetwork selector')

	return {
		selector: globalYoutubeNetworkSelector,
	}
}
