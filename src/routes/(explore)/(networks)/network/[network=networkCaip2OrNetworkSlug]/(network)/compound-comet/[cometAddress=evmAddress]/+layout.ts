// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CompoundCometSchema from '$/schema/CompoundComet.ts'
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
		&& matchEvmAddress(params.cometAddress)
	))
		error(404, 'Route mapping not applicable')

	const compoundCometNetworkCometAddressSelector = parseEntitySelector(
		schema,
		CompoundCometSchema,
		{
			$network: parentData.selector,
			cometAddress: params.cometAddress,
		},
		'NetworkCometAddress'
	)
	if (compoundCometNetworkCometAddressSelector instanceof arktype.errors)
		error(404, 'Invalid CompoundComet selector')

	return {
		selector: compoundCometNetworkCometAddressSelector,
	}
}
