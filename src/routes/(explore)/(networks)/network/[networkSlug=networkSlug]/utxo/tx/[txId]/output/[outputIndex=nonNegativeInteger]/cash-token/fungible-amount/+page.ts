// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkBySlug } from '$/constants/Network.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { BitcoinCashCashTokenFungibleAmount as BitcoinCashCashTokenFungibleAmountSchema } from '$/schema/BitcoinCashCashTokenFungibleAmount.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Route surface eligibility: requiredProjections=[['Utxo'], ['CashTokens']]
export const load: PageLoad = ({ params }) => {
	const routeSurfaceNetwork = Object.getOwnPropertyDescriptor(networkBySlug, params.networkSlug)?.value
	if (routeSurfaceNetwork == null) error(404, 'Network route surface not found')
	if (!((routeSurfaceNetwork.ledgerModels !== undefined && routeSurfaceNetwork.ledgerModels.some((value: string | number | boolean | null) => value === 'Utxo')) && routeSurfaceNetwork.namespace === 'BitcoinCash')) error(404, 'Network facet not available')

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
