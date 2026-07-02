// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import UtxoAddress_TimestampSchema from '$/schema/UtxoAddress_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const utxoAddressTimestampSelector = parseEntitySelector(
		schema,
		UtxoAddress_TimestampSchema,
		{
			$address: {
				$network: {
					slug: params.networkSlug,
				},
				address: decodeURIComponent(params.address),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (utxoAddressTimestampSelector instanceof arktype.errors) error(404, 'Invalid UtxoAddress_Timestamp selector')

	return {
		selector: utxoAddressTimestampSelector,
	}
}
