// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadEvmWalletRequestSchema from '$/schema/BlockheadEvmWalletRequest.ts'
import BlockheadWalletRequestSchema from '$/schema/BlockheadWalletRequest.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const blockheadWalletRequestIdParentSelector = parseRouteEntitySelector(
		schema,
		BlockheadWalletRequestSchema,
		parentData.selector,
		'Id'
	)
	if (blockheadWalletRequestIdParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const blockheadEvmWalletRequestEvmWalletRequestSelector = parseRouteEntitySelector(
		schema,
		BlockheadEvmWalletRequestSchema,
		{
			$walletRequest: blockheadWalletRequestIdParentSelector,
		},
		'EvmWalletRequest'
	)
	if (blockheadEvmWalletRequestEvmWalletRequestSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadEvmWalletRequest selector')

	return {
		selector: blockheadEvmWalletRequestEvmWalletRequestSelector,
	}
}
