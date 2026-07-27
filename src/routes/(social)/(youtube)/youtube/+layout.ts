// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import _GlobalYoutubeNetworkSchema from '$/schema/_GlobalYoutubeNetwork.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const globalYoutubeNetworkScopeSelector = parseEntitySelector(
		schema,
		_GlobalYoutubeNetworkSchema,
		{
			scope: '_GlobalYoutubeNetwork',
		}
	)
	if (globalYoutubeNetworkScopeSelector instanceof arktype.errors) error(404, 'Invalid _GlobalYoutubeNetwork selector')

	return {
		selector: globalYoutubeNetworkScopeSelector,
	}
}
