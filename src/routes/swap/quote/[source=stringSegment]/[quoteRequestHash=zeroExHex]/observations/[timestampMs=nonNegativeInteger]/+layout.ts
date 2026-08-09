// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SwapQuote_TimestampSchema from '$/schema/SwapQuote_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(
		matchStringSegment(params.source)
		&& matchZeroExHex(params.quoteRequestHash)
		&& matchNonNegativeInteger(params.timestampMs)
	))
		error(404, 'Route mapping not applicable')

	const swapQuoteTimestampSourceQuoteRequestHashTimestampMsSelector = parseEntitySelector(
		schema,
		SwapQuote_TimestampSchema,
		{
			source: params.source,
			quoteRequestHash: params.quoteRequestHash,
			timestampMs: Number(params.timestampMs),
		},
		'SourceQuoteRequestHashTimestampMs'
	)
	if (swapQuoteTimestampSourceQuoteRequestHashTimestampMsSelector instanceof arktype.errors)
		error(404, 'Invalid SwapQuote_Timestamp selector')

	return {
		selector: swapQuoteTimestampSourceQuoteRequestHashTimestampMsSelector,
	}
}
