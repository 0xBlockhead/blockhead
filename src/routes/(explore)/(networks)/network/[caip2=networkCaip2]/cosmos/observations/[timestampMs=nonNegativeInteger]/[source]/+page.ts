// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CosmosNetwork_TimestampSchema from '$/schema/CosmosNetwork_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const cosmosNetworkTimestampSelector = parseEntitySelector(
		schema,
		CosmosNetwork_TimestampSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (cosmosNetworkTimestampSelector instanceof arktype.errors) error(404, 'Invalid CosmosNetwork_Timestamp selector')

	return {
		selector: cosmosNetworkTimestampSelector,
	}
}
