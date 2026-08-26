// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import LightningChannel_TimestampSchema from '$/schema/LightningChannel_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.source) && matchNonNegativeInteger(params.timestampMs)))
		error(404, 'Route mapping not applicable')

	const lightningChannelTimestampChannelTimestampMsSourceSelector = parseRouteEntitySelector(
		schema,
		LightningChannel_TimestampSchema,
		{
			$channel: parentData.selector,
			timestampMs: Number(params.timestampMs),
			source: params.source,
		},
		'ChannelTimestampMsSource'
	)
	if (lightningChannelTimestampChannelTimestampMsSourceSelector instanceof arktype.errors)
		error(404, 'Invalid LightningChannel_Timestamp selector')

	return {
		selector: lightningChannelTimestampChannelTimestampMsSourceSelector,
	}
}
