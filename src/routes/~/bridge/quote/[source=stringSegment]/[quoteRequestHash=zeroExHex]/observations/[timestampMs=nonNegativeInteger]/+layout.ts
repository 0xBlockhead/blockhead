// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BridgeRouteQuote_TimestampSchema from '$/schema/BridgeRouteQuote_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(
		matchStringSegment(params.source)
		&& matchZeroExHex(params.quoteRequestHash)
		&& matchNonNegativeInteger(params.timestampMs)
	))
		error(404, 'Route mapping not applicable')

	const bridgeRouteQuoteTimestampSourceQuoteRequestHashTimestampMsSelector = parseEntitySelector(
		schema,
		BridgeRouteQuote_TimestampSchema,
		{
			source: params.source,
			quoteRequestHash: params.quoteRequestHash,
			timestampMs: Number(params.timestampMs),
		},
		'SourceQuoteRequestHashTimestampMs'
	)
	if (bridgeRouteQuoteTimestampSourceQuoteRequestHashTimestampMsSelector instanceof arktype.errors)
		error(404, 'Invalid BridgeRouteQuote_Timestamp selector')

	return {
		selector: bridgeRouteQuoteTimestampSourceQuoteRequestHashTimestampMsSelector,
	}
}
