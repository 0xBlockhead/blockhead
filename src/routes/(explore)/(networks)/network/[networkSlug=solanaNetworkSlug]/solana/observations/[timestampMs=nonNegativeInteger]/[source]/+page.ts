// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkBySlug } from '$/constants/Network.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SolanaNetwork_TimestampSchema from '$/schema/SolanaNetwork_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const solanaNetworkTimestampSelector = parseEntitySelector(
		schema,
		SolanaNetwork_TimestampSchema,
		{
			$network: {
				caip2: networkBySlug[params.networkSlug].caip2,
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (solanaNetworkTimestampSelector instanceof arktype.errors) error(404, 'Invalid SolanaNetwork_Timestamp selector')

	return {
		selector: solanaNetworkTimestampSelector,
	}
}
