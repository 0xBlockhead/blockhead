// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { BitcoinCashCashTokenNft as BitcoinCashCashTokenNftSchema } from '$/schema/BitcoinCashCashTokenNft.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['CashTokens']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

	if (!(projectionNetwork.namespace === 'BitcoinCash')) error(404, 'Route mapping not applicable')

	const bitcoinCashCashTokenNftUtxoOutputSelector = parseEntitySelector(
		schema,
		BitcoinCashCashTokenNftSchema,
		{
			$output: parentData.selector,
		}
	)
	if (bitcoinCashCashTokenNftUtxoOutputSelector instanceof arktype.errors) error(404, 'Invalid BitcoinCashCashTokenNft selector')

	return {
		selector: bitcoinCashCashTokenNftUtxoOutputSelector,
	}
}
