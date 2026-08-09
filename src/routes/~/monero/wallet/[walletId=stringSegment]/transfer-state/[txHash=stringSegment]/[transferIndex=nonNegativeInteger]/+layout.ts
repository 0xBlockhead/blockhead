// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadMoneroTransferStateSchema from '$/schema/BlockheadMoneroTransferState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(
		matchStringSegment(params.walletId)
		&& matchStringSegment(params.txHash)
		&& matchNonNegativeInteger(params.transferIndex)
	))
		error(404, 'Route mapping not applicable')

	const blockheadMoneroTransferStateWalletIdTxHashTransferIndexSelector = parseEntitySelector(
		schema,
		BlockheadMoneroTransferStateSchema,
		{
			walletId: params.walletId,
			txHash: params.txHash,
			transferIndex: Number(params.transferIndex),
		},
		'WalletIdTxHashTransferIndex'
	)
	if (blockheadMoneroTransferStateWalletIdTxHashTransferIndexSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadMoneroTransferState selector')

	return {
		selector: blockheadMoneroTransferStateWalletIdTxHashTransferIndexSelector,
	}
}
