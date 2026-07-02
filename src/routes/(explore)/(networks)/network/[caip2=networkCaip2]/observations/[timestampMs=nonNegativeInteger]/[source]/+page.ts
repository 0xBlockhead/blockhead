// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import Network_TimestampSchema from '$/schema/Network_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const networkTimestampSelector = parseEntitySelector(
		schema,
		Network_TimestampSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (networkTimestampSelector instanceof arktype.errors) error(404, 'Invalid Network_Timestamp selector')

	return {
		selector: networkTimestampSelector,
	}
}
