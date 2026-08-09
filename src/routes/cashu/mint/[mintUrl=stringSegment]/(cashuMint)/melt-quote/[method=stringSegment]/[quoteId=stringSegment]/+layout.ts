// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadCashuMeltQuoteSchema from '$/schema/BlockheadCashuMeltQuote.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.method) && matchStringSegment(params.quoteId)))
		error(404, 'Route mapping not applicable')

	const blockheadCashuMeltQuoteMintMethodQuoteIdSelector = parseEntitySelector(
		schema,
		BlockheadCashuMeltQuoteSchema,
		{
			$mint: parentData.selector,
			method: params.method,
			quoteId: params.quoteId,
		},
		'MintMethodQuoteId'
	)
	if (blockheadCashuMeltQuoteMintMethodQuoteIdSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadCashuMeltQuote selector')

	return {
		selector: blockheadCashuMeltQuoteMintMethodQuoteIdSelector,
	}
}
