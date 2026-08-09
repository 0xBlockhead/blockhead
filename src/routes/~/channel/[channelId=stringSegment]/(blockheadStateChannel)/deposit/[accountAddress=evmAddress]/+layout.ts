// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadStateChannelDepositSchema from '$/schema/BlockheadStateChannelDeposit.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchEvmAddress(params.accountAddress)))
		error(404, 'Route mapping not applicable')

	const blockheadStateChannelDepositChannelAccountSelector = parseEntitySelector(
		schema,
		BlockheadStateChannelDepositSchema,
		{
			$channel: parentData.selector,
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
