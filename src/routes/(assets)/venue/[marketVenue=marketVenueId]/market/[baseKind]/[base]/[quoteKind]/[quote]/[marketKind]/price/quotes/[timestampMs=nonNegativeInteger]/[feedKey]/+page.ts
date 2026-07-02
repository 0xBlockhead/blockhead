// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import Market_TimestampSchema from '$/schema/Market_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const marketTimestampSelector = parseEntitySelector(
		schema,
		Market_TimestampSchema,
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
	if (marketTimestampSelector instanceof arktype.errors) error(404, 'Invalid Market_Timestamp selector')

	return {
		selector: marketTimestampSelector,
	}
}
