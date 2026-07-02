// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CosmosAccount_TimestampSchema from '$/schema/CosmosAccount_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const cosmosAccountTimestampSelector = parseEntitySelector(
		schema,
		CosmosAccount_TimestampSchema,
		{
			$account: {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				address: decodeURIComponent(params.address),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (cosmosAccountTimestampSelector instanceof arktype.errors) error(404, 'Invalid CosmosAccount_Timestamp selector')

	return {
		selector: cosmosAccountTimestampSelector,
	}
}
