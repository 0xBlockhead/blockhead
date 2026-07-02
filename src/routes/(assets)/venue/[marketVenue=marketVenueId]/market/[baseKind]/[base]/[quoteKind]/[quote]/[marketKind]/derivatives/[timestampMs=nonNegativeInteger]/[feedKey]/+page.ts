// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import Market_Derivative_TimestampSchema from '$/schema/Market_Derivative_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const marketDerivativeTimestampSelector = parseEntitySelector(
		schema,
		Market_Derivative_TimestampSchema,
		{
			$market: {
				$marketVenue: {
					marketVenueId: params.marketVenue,
				},
				$base: (
				params.baseKind === 'coin' ?
					{
						kind: 'Coin',
						$coin: {
							coinId: decodeURIComponent(params.base),
						},
					}
				:
					{
						kind: 'Currency',
						$currency: {
							iso4217: decodeURIComponent(params.base),
						},
					}
				),
				$quote: (
				params.quoteKind === 'coin' ?
					{
						kind: 'Coin',
						$coin: {
							coinId: decodeURIComponent(params.quote),
						},
					}
				:
					{
						kind: 'Currency',
						$currency: {
							iso4217: decodeURIComponent(params.quote),
						},
					}
				),
				marketKind: params.marketKind,
			},
			timestampMs: Number(params.timestampMs),
			feedKey: decodeURIComponent(params.feedKey),
		}
	)
	if (marketDerivativeTimestampSelector instanceof arktype.errors) error(404, 'Invalid Market_Derivative_Timestamp selector')

	return {
		selector: marketDerivativeTimestampSelector,
	}
}
