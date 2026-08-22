// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import Erc4337SmartAccountSchema from '$/schema/Erc4337SmartAccount.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			parentData.projectionNetwork.executionModels !== undefined
			&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
		)
		&& matchEvmAddress(params.address)
	))
		error(404, 'Route mapping not applicable')

	const erc4337SmartAccountEvmNetworkAddressSelector = parseEntitySelector(
		schema,
		Erc4337SmartAccountSchema,
		{
			$network: parentData.selector,
			address: params.address,
		},
		'EvmNetworkAddress'
	)
	if (erc4337SmartAccountEvmNetworkAddressSelector instanceof arktype.errors)
		error(404, 'Invalid Erc4337SmartAccount selector')

	return {
		selector: erc4337SmartAccountEvmNetworkAddressSelector,
	}
}
