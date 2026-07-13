// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { Coin as CoinSchema } from '$/schema/Coin.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.coinId))) error(404, 'Route mapping not applicable')

	const coinCoinIdSelector = parseEntitySelector(
		schema,
		CoinSchema,
		{
			coinId: params.coinId,
		}
	)
	if (coinCoinIdSelector instanceof arktype.errors) error(404, 'Invalid Coin selector')

	return {
		selector: coinCoinIdSelector,
	}
}
