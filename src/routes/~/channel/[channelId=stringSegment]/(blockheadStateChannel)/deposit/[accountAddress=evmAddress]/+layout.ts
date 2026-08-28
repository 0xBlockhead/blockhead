// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadStateChannelSchema from '$/schema/BlockheadStateChannel.ts'
import BlockheadStateChannelDepositSchema from '$/schema/BlockheadStateChannelDeposit.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchEvmAddress(params.accountAddress)))
		error(404, 'Route mapping not applicable')

	const blockheadStateChannelIdParentSelector = parseRouteEntitySelector(
		schema,
		BlockheadStateChannelSchema,
		parentData.selector,
		'Id'
	)
	if (blockheadStateChannelIdParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const blockheadStateChannelDepositChannelAccountSelector = parseRouteEntitySelector(
		schema,
		BlockheadStateChannelDepositSchema,
		{
			$channel: blockheadStateChannelIdParentSelector,
			$account: {
				address: params.accountAddress,
			},
		},
		'ChannelAccount'
	)
	if (blockheadStateChannelDepositChannelAccountSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadStateChannelDeposit selector')

	return {
		selector: blockheadStateChannelDepositChannelAccountSelector,
	}
}
