// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BitcoinCashCashTokenNftSchema from '$/schema/BitcoinCashCashTokenNft.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const bitcoinCashCashTokenNftSelector = parseEntitySelector(
		schema,
		BitcoinCashCashTokenNftSchema,
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
	if (bitcoinCashCashTokenNftSelector instanceof arktype.errors) error(404, 'Invalid BitcoinCashCashTokenNft selector')

	return {
		selector: bitcoinCashCashTokenNftSelector,
	}
}
