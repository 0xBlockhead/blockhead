// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import CurvePoolSchema from '$/schema/CurvePool.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			(
				parentData.projectionNetwork.executionModels !== undefined
				&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
			)
			&& parentData.projectionNetwork.namespace === 'Evm'
		)
		&& matchEvmAddress(params.poolAddress)
	))
		error(404, 'Route mapping not applicable')

	const curvePoolNetworkPoolAddressSelector = parseRouteEntitySelector(
		schema,
		CurvePoolSchema,
		{
			$network: parentData.selector,
			poolAddress: params.poolAddress,
		},
		'NetworkPoolAddress'
	)
	if (curvePoolNetworkPoolAddressSelector instanceof arktype.errors)
		error(404, 'Invalid CurvePool selector')

	return {
		selector: curvePoolNetworkPoolAddressSelector,
	}
}
