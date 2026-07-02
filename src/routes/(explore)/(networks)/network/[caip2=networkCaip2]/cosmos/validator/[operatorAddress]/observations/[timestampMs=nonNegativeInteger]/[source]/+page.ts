// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CosmosValidator_TimestampSchema from '$/schema/CosmosValidator_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const cosmosValidatorTimestampSelector = parseEntitySelector(
		schema,
		CosmosValidator_TimestampSchema,
		{
			$validator: {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				operatorAddress: decodeURIComponent(params.operatorAddress),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (cosmosValidatorTimestampSelector instanceof arktype.errors) error(404, 'Invalid CosmosValidator_Timestamp selector')

	return {
		selector: cosmosValidatorTimestampSelector,
	}
}
