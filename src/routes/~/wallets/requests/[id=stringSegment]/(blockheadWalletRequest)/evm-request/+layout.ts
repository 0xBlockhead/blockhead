// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadEvmWalletRequestSchema from '$/schema/BlockheadEvmWalletRequest.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const blockheadEvmWalletRequestEvmWalletRequestSelector = parseEntitySelector(
		schema,
		BlockheadEvmWalletRequestSchema,
		{
			$walletRequest: parentData.selector,
		},
		'EvmWalletRequest'
	)
	if (blockheadEvmWalletRequestEvmWalletRequestSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadEvmWalletRequest selector')

	return {
		selector: blockheadEvmWalletRequestEvmWalletRequestSelector,
	}
}
