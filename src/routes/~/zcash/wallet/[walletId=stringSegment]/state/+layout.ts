// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadZcashWalletStateSchema from '$/schema/BlockheadZcashWalletState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.walletId)))
		error(404, 'Route mapping not applicable')

	const blockheadZcashWalletStateWalletIdSelector = parseEntitySelector(
		schema,
		BlockheadZcashWalletStateSchema,
		{
			walletId: params.walletId,
		},
		'WalletId'
	)
	if (blockheadZcashWalletStateWalletIdSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadZcashWalletState selector')

	return {
		selector: blockheadZcashWalletStateWalletIdSelector,
	}
}
