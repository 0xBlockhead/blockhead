// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CoinSchema from '$/schema/Coin.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const coinSelector = parseEntitySelector(
		schema,
		CoinSchema,
		{
			coinId: params.coinId,
		}
	)
	if (coinSelector instanceof arktype.errors) error(404, 'Invalid Coin selector')

	return {
		selector: coinSelector,
	}
}
