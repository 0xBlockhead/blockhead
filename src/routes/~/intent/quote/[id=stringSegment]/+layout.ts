// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadIntentQuoteSchema from '$/schema/BlockheadIntentQuote.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.id)))
		error(404, 'Route mapping not applicable')

	const blockheadIntentQuoteIdSelector = parseEntitySelector(
		schema,
		BlockheadIntentQuoteSchema,
		{
			id: params.id,
		},
		'Id'
	)
	if (blockheadIntentQuoteIdSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadIntentQuote selector')

	return {
		selector: blockheadIntentQuoteIdSelector,
	}
}
