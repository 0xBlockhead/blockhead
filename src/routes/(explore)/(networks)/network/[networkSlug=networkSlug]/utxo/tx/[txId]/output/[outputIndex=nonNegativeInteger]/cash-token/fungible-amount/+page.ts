// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BitcoinCashCashTokenFungibleAmountSchema from '$/schema/BitcoinCashCashTokenFungibleAmount.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const bitcoinCashCashTokenFungibleAmountSelector = parseEntitySelector(
		schema,
		BitcoinCashCashTokenFungibleAmountSchema,
		{
			$output: {
				$transaction: {
					$network: {
						slug: params.networkSlug,
					},
					txId: decodeURIComponent(params.txId),
				},
				indexInTransaction: Number(params.outputIndex),
			},
		}
	)
	if (bitcoinCashCashTokenFungibleAmountSelector instanceof arktype.errors) error(404, 'Invalid BitcoinCashCashTokenFungibleAmount selector')

	return {
		selector: bitcoinCashCashTokenFungibleAmountSelector,
	}
}
