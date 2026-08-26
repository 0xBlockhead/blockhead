// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadMoneroOutputStateSchema from '$/schema/BlockheadMoneroOutputState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.walletId) && matchStringSegment(params.txHash) && matchNonNegativeInteger(params.outputIndex)))
		error(404, 'Route mapping not applicable')

	const blockheadMoneroOutputStateWalletIdTxHashOutputIndexSelector = parseRouteEntitySelector(
		schema,
		BlockheadMoneroOutputStateSchema,
		{
			walletId: params.walletId,
			txHash: params.txHash,
			outputIndex: Number(params.outputIndex),
		},
		'WalletIdTxHashOutputIndex'
	)
	if (blockheadMoneroOutputStateWalletIdTxHashOutputIndexSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadMoneroOutputState selector')

	return {
		selector: blockheadMoneroOutputStateWalletIdTxHashOutputIndexSelector,
	}
}
