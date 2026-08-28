// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import TonAccountSchema from '$/schema/TonAccount.ts'
import TonTransactionSchema from '$/schema/TonTransaction.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchNonNegativeBigInt(params.lt)))
		error(404, 'Route mapping not applicable')

	const tonAccountNetworkAddressParentSelector = parseRouteEntitySelector(
		schema,
		TonAccountSchema,
		parentData.selector,
		'NetworkAddress'
	)
	if (tonAccountNetworkAddressParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const tonTransactionAccountLtSelector = parseRouteEntitySelector(
		schema,
		TonTransactionSchema,
		{
			$account: tonAccountNetworkAddressParentSelector,
			lt: BigInt(params.lt),
		},
		'AccountLt'
	)
	if (tonTransactionAccountLtSelector instanceof arktype.errors)
		error(404, 'Invalid TonTransaction selector')

	return {
		selector: tonTransactionAccountLtSelector,
	}
}
