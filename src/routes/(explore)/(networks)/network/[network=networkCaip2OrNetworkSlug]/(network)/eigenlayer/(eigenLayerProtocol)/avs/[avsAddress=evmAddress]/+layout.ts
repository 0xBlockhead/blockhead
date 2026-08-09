// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EigenLayerAvsSchema from '$/schema/EigenLayerAvs.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchEvmAddress(params.avsAddress)))
		error(404, 'Route mapping not applicable')

	const eigenLayerAvsNetworkAvsAddressSelector = parseEntitySelector(
		schema,
		EigenLayerAvsSchema,
		{
			$network: parentData.selector,
			avsAddress: params.avsAddress,
		},
		'NetworkAvsAddress'
	)
	if (eigenLayerAvsNetworkAvsAddressSelector instanceof arktype.errors)
		error(404, 'Invalid EigenLayerAvs selector')

	return {
		selector: eigenLayerAvsNetworkAvsAddressSelector,
	}
}
