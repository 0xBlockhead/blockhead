// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import CompoundCometSchema from '$/schema/CompoundComet.ts'
import CompoundPositionSchema from '$/schema/CompoundPosition.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchEvmAddress(params.accountAddress)))
		error(404, 'Route mapping not applicable')

	const compoundCometNetworkCometAddressParentSelector = parseRouteEntitySelector(
		schema,
		CompoundCometSchema,
		parentData.selector,
		'NetworkCometAddress'
	)
	if (compoundCometNetworkCometAddressParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const compoundPositionAccountCometSelector = parseRouteEntitySelector(
		schema,
		CompoundPositionSchema,
		{
			$account: {
				$network: compoundCometNetworkCometAddressParentSelector.$network,
				$actor: {
					address: params.accountAddress,
				},
			},
			$comet: compoundCometNetworkCometAddressParentSelector,
		},
		'AccountComet'
	)
	if (compoundPositionAccountCometSelector instanceof arktype.errors)
		error(404, 'Invalid CompoundPosition selector')

	return {
		selector: compoundPositionAccountCometSelector,
	}
}
