// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchAbsoluteUrl } from '$/params/absoluteUrl.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadCashuWalletStateSchema from '$/schema/BlockheadCashuWalletState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.walletId) && matchAbsoluteUrl(params.mintUrl) && matchStringSegment(params.unit)))
		error(404, 'Route mapping not applicable')

	const blockheadCashuWalletStateWalletIdMintUrlUnitSelector = parseRouteEntitySelector(
		schema,
		BlockheadCashuWalletStateSchema,
		{
			walletId: params.walletId,
			mintUrl: decodeURIComponent(params.mintUrl),
			unit: params.unit,
		},
		'WalletIdMintUrlUnit'
	)
	if (blockheadCashuWalletStateWalletIdMintUrlUnitSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadCashuWalletState selector')

	return {
		selector: blockheadCashuWalletStateWalletIdMintUrlUnitSelector,
	}
}
