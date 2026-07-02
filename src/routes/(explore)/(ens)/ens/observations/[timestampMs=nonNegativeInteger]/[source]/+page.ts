// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import _GlobalEnsNetwork_TimestampSchema from '$/schema/_GlobalEnsNetwork_Timestamp.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const globalEnsNetworkTimestampSelector = parseEntitySelector(
		schema,
		_GlobalEnsNetwork_TimestampSchema,
		{
			$hub: {
				scope: '_GlobalEnsNetwork',
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (globalEnsNetworkTimestampSelector instanceof arktype.errors) error(404, 'Invalid _GlobalEnsNetwork_Timestamp selector')

	return {
		selector: globalEnsNetworkTimestampSelector,
	}
}
