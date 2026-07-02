// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadWalletConnectionSchema from '$/schema/BlockheadWalletConnection.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const blockheadWalletConnectionSelector = parseEntitySelector(
		schema,
		BlockheadWalletConnectionSchema,
		{
			$wallet: {
				id: decodeURIComponent(params.walletId),
			},
		}
	)
	if (blockheadWalletConnectionSelector instanceof arktype.errors) error(404, 'Invalid BlockheadWalletConnection selector')

	return {
		selector: blockheadWalletConnectionSelector,
	}
}
