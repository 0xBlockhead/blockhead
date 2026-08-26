// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BitcoinCashCashTokenCategorySchema from '$/schema/BitcoinCashCashTokenCategory.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['CashTokens']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'BitcoinCash' && matchStringSegment(params.categoryId)))
		error(404, 'Route mapping not applicable')

	const bitcoinCashCashTokenCategoryNetworkCategoryIdSelector = parseRouteEntitySelector(
		schema,
		BitcoinCashCashTokenCategorySchema,
		{
			$network: parentData.selector,
			categoryId: params.categoryId,
		},
		'NetworkCategoryId'
	)
	if (bitcoinCashCashTokenCategoryNetworkCategoryIdSelector instanceof arktype.errors)
		error(404, 'Invalid BitcoinCashCashTokenCategory selector')

	return {
		selector: bitcoinCashCashTokenCategoryNetworkCategoryIdSelector,
	}
}
