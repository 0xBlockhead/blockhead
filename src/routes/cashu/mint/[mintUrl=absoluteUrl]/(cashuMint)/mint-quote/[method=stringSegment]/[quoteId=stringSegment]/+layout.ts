// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadCashuMintQuoteSchema from '$/schema/BlockheadCashuMintQuote.ts'
import CashuMintSchema from '$/schema/CashuMint.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.method) && matchStringSegment(params.quoteId)))
		error(404, 'Route mapping not applicable')

	const cashuMintMintUrlParentSelector = parseRouteEntitySelector(
		schema,
		CashuMintSchema,
		parentData.selector,
		'MintUrl'
	)
	if (cashuMintMintUrlParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const blockheadCashuMintQuoteMintMethodQuoteIdSelector = parseRouteEntitySelector(
		schema,
		BlockheadCashuMintQuoteSchema,
		{
			$mint: cashuMintMintUrlParentSelector,
			method: params.method,
			quoteId: params.quoteId,
		},
		'MintMethodQuoteId'
	)
	if (blockheadCashuMintQuoteMintMethodQuoteIdSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadCashuMintQuote selector')

	return {
		selector: blockheadCashuMintQuoteMintMethodQuoteIdSelector,
	}
}
