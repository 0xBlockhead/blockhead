// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import UtxoNetwork_TimestampSchema from '$/schema/UtxoNetwork_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const utxoNetworkTimestampSelector = parseEntitySelector(
		schema,
		UtxoNetwork_TimestampSchema,
		{
			$network: {
				slug: params.networkSlug,
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (utxoNetworkTimestampSelector instanceof arktype.errors) error(404, 'Invalid UtxoNetwork_Timestamp selector')

	return {
		selector: utxoNetworkTimestampSelector,
	}
}
