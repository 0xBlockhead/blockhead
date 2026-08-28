// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import TonAccountSchema from '$/schema/TonAccount.ts'
import TonContractSchema from '$/schema/TonContract.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const tonAccountNetworkAddressParentSelector = parseRouteEntitySelector(
		schema,
		TonAccountSchema,
		parentData.selector,
		'NetworkAddress'
	)
	if (tonAccountNetworkAddressParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const tonContractAccountSelector = parseRouteEntitySelector(
		schema,
		TonContractSchema,
		{
			$account: tonAccountNetworkAddressParentSelector,
		},
		'Account'
	)
	if (tonContractAccountSelector instanceof arktype.errors)
		error(404, 'Invalid TonContract selector')

	return {
		selector: tonContractAccountSelector,
	}
}
