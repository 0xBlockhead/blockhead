// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import TonJettonSchema from '$/schema/TonJetton.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.masterAddress)))
		error(404, 'Route mapping not applicable')

	const tonJettonNetworkMasterAddressSelector = parseRouteEntitySelector(
		schema,
		TonJettonSchema,
		{
			$network: parentData.selector,
			masterAddress: params.masterAddress,
		},
		'NetworkMasterAddress'
	)
	if (tonJettonNetworkMasterAddressSelector instanceof arktype.errors)
		error(404, 'Invalid TonJetton selector')

	return {
		selector: tonJettonNetworkMasterAddressSelector,
	}
}
