// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BitcoinCashCashTokenCategorySchema from '$/schema/BitcoinCashCashTokenCategory.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const bitcoinCashCashTokenCategorySelector = parseEntitySelector(
		schema,
		BitcoinCashCashTokenCategorySchema,
		{
			$network: {
				slug: params.networkSlug,
			},
			categoryId: decodeURIComponent(params.categoryId),
		}
	)
	if (bitcoinCashCashTokenCategorySelector instanceof arktype.errors) error(404, 'Invalid BitcoinCashCashTokenCategory selector')

	return {
		selector: bitcoinCashCashTokenCategorySelector,
	}
}
