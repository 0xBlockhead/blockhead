// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import PythPriceFeedSchema from '$/schema/PythPriceFeed.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchZeroExHex(params.priceFeedId) && matchStringSegment(params.channel)))
		error(404, 'Route mapping not applicable')

	const pythPriceFeedPriceFeedIdChannelSelector = parseRouteEntitySelector(
		schema,
		PythPriceFeedSchema,
		{
			priceFeedId: params.priceFeedId,
			channel: params.channel,
		},
		'PriceFeedIdChannel'
	)
	if (pythPriceFeedPriceFeedIdChannelSelector instanceof arktype.errors)
		error(404, 'Invalid PythPriceFeed selector')

	return {
		selector: pythPriceFeedPriceFeedIdChannelSelector,
	}
}
