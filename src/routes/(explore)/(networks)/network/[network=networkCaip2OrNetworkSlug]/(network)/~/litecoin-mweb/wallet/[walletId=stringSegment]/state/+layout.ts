// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadLitecoinMwebWalletStateSchema from '$/schema/BlockheadLitecoinMwebWalletState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.walletId)))
		error(404, 'Route mapping not applicable')

	const blockheadLitecoinMwebWalletStateWalletIdNetworkSelector = parseEntitySelector(
		schema,
		BlockheadLitecoinMwebWalletStateSchema,
		{
			walletId: params.walletId,
			$network: parentData.selector,
		},
		'WalletIdNetwork'
	)
	if (blockheadLitecoinMwebWalletStateWalletIdNetworkSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadLitecoinMwebWalletState selector')

	return {
		selector: blockheadLitecoinMwebWalletStateWalletIdNetworkSelector,
	}
}
