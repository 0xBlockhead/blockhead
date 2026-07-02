// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BitcoinCashCashTokenCommitmentSchema from '$/schema/BitcoinCashCashTokenCommitment.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const bitcoinCashCashTokenCommitmentSelector = parseEntitySelector(
		schema,
		BitcoinCashCashTokenCommitmentSchema,
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
	if (bitcoinCashCashTokenCommitmentSelector instanceof arktype.errors) error(404, 'Invalid BitcoinCashCashTokenCommitment selector')

	return {
		selector: bitcoinCashCashTokenCommitmentSelector,
	}
}
