// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadMoneroSubaddressStateSchema from '$/schema/BlockheadMoneroSubaddressState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(
		matchStringSegment(params.walletId)
		&& matchNonNegativeInteger(params.accountIndex)
		&& matchNonNegativeInteger(params.addressIndex)
	))
		error(404, 'Route mapping not applicable')

	const blockheadMoneroSubaddressStateWalletIdAccountIndexAddressIndexSelector = parseRouteEntitySelector(
		schema,
		BlockheadMoneroSubaddressStateSchema,
		{
			walletId: params.walletId,
			accountIndex: Number(params.accountIndex),
			addressIndex: Number(params.addressIndex),
		},
		'WalletIdAccountIndexAddressIndex'
	)
	if (blockheadMoneroSubaddressStateWalletIdAccountIndexAddressIndexSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadMoneroSubaddressState selector')

	return {
		selector: blockheadMoneroSubaddressStateWalletIdAccountIndexAddressIndexSelector,
	}
}
