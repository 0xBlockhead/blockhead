// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadMoneroWalletStateSchema from '$/schema/BlockheadMoneroWalletState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.walletId)))
		error(404, 'Route mapping not applicable')

	const blockheadMoneroWalletStateWalletIdSelector = parseRouteEntitySelector(
		schema,
		BlockheadMoneroWalletStateSchema,
		{
			walletId: params.walletId,
		},
		'WalletId'
	)
	if (blockheadMoneroWalletStateWalletIdSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadMoneroWalletState selector')

	return {
		selector: blockheadMoneroWalletStateWalletIdSelector,
	}
}
