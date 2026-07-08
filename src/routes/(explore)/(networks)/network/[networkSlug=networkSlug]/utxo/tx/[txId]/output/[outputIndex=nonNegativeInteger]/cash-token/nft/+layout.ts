// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkBySlug } from '$/constants/Network.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { BitcoinCashCashTokenNft as BitcoinCashCashTokenNftSchema } from '$/schema/BitcoinCashCashTokenNft.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Route surface eligibility: requiredProjections=[['Utxo'], ['CashTokens']]
export const load: LayoutLoad = ({ params }) => {
	const routeSurfaceNetwork = Object.getOwnPropertyDescriptor(networkBySlug, params.networkSlug)?.value
	if (routeSurfaceNetwork == null) error(404, 'Network route surface not found')
	if (!((routeSurfaceNetwork.ledgerModels !== undefined && routeSurfaceNetwork.ledgerModels.some((value: string | number | boolean | null) => value === 'Utxo')) && routeSurfaceNetwork.namespace === 'BitcoinCash')) error(404, 'Network facet not available')

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
