// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import _GlobalYoutubeNetwork_TimestampSchema from '$/schema/_GlobalYoutubeNetwork_Timestamp.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const globalYoutubeNetworkTimestampSelector = parseEntitySelector(
		schema,
		_GlobalYoutubeNetwork_TimestampSchema,
		{
			$hub: {
				scope: '_GlobalYoutubeNetwork',
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (globalYoutubeNetworkTimestampSelector instanceof arktype.errors) error(404, 'Invalid _GlobalYoutubeNetwork_Timestamp selector')

	return {
		selector: globalYoutubeNetworkTimestampSelector,
	}
}
