// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import PayoutSchema from '$/schema/Payout.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.payoutSource) && matchStringSegment(params.payoutId)))
		error(404, 'Route mapping not applicable')

	const payoutSourcePayoutIdSelector = parseRouteEntitySelector(
		schema,
		PayoutSchema,
		{
			source: params.payoutSource,
			payoutId: params.payoutId,
		},
		'SourcePayoutId'
	)
	if (payoutSourcePayoutIdSelector instanceof arktype.errors)
		error(404, 'Invalid Payout selector')

	return {
		selector: payoutSourcePayoutIdSelector,
	}
}
