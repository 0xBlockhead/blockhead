// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import PolkadotNetwork_TimestampSchema from '$/schema/PolkadotNetwork_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const polkadotNetworkTimestampSelector = parseEntitySelector(
		schema,
		PolkadotNetwork_TimestampSchema,
		{
			$network: {
				slug: params.networkSlug,
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (polkadotNetworkTimestampSelector instanceof arktype.errors) error(404, 'Invalid PolkadotNetwork_Timestamp selector')

	return {
		selector: polkadotNetworkTimestampSelector,
	}
}
