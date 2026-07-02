// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import Coin_TimestampSchema from '$/schema/Coin_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const coinTimestampSelector = parseEntitySelector(
		schema,
		Coin_TimestampSchema,
		{
			$coin: {
				coinId: decodeURIComponent(params.coinId),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (coinTimestampSelector instanceof arktype.errors) error(404, 'Invalid Coin_Timestamp selector')

	return {
		selector: coinTimestampSelector,
	}
}
