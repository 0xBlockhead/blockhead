// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadQuilibriumAccountStateSchema from '$/schema/BlockheadQuilibriumAccountState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.connectionId) && matchStringSegment(params.accountAddress)))
		error(404, 'Route mapping not applicable')

	const blockheadQuilibriumAccountStateConnectionIdNetworkAccountAddressSelector = parseRouteEntitySelector(
		schema,
		BlockheadQuilibriumAccountStateSchema,
		{
			connectionId: params.connectionId,
			$network: parentData.selector,
			accountAddress: params.accountAddress,
		},
		'ConnectionIdNetworkAccountAddress'
	)
	if (blockheadQuilibriumAccountStateConnectionIdNetworkAccountAddressSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadQuilibriumAccountState selector')

	return {
		selector: blockheadQuilibriumAccountStateConnectionIdNetworkAccountAddressSelector,
	}
}
