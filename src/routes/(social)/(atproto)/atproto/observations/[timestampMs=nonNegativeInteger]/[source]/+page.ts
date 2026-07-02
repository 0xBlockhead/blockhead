// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import _GlobalAtprotoNetwork_TimestampSchema from '$/schema/_GlobalAtprotoNetwork_Timestamp.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const globalAtprotoNetworkTimestampSelector = parseEntitySelector(
		schema,
		_GlobalAtprotoNetwork_TimestampSchema,
		{
			$hub: {
				scope: '_GlobalAtprotoNetwork',
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (globalAtprotoNetworkTimestampSelector instanceof arktype.errors) error(404, 'Invalid _GlobalAtprotoNetwork_Timestamp selector')

	return {
		selector: globalAtprotoNetworkTimestampSelector,
	}
}
