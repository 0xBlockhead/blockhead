// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EthereumBeaconFinality_TimestampSchema from '$/schema/EthereumBeaconFinality_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const ethereumBeaconFinalityTimestampSelector = parseEntitySelector(
		schema,
		EthereumBeaconFinality_TimestampSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			timestampMs: Number(params.timestampMs),
		}
	)
	if (ethereumBeaconFinalityTimestampSelector instanceof arktype.errors) error(404, 'Invalid EthereumBeaconFinality_Timestamp selector')

	return {
		selector: ethereumBeaconFinalityTimestampSelector,
	}
}
