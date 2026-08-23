// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EigenLayerOperatorSchema from '$/schema/EigenLayerOperator.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchEvmAddress(params.operatorAddress)))
		error(404, 'Route mapping not applicable')

	const eigenLayerOperatorNetworkOperatorAddressSelector = parseEntitySelector(
		schema,
		EigenLayerOperatorSchema,
		{
			$network: parentData.selector.$network,
			operatorAddress: params.operatorAddress,
		},
		'NetworkOperatorAddress'
	)
	if (eigenLayerOperatorNetworkOperatorAddressSelector instanceof arktype.errors)
		error(404, 'Invalid EigenLayerOperator selector')

	return {
		selector: eigenLayerOperatorNetworkOperatorAddressSelector,
	}
}
