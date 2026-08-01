// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import Erc4337AccountFactorySchema from '$/schema/Erc4337AccountFactory.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			parentData.projectionNetwork.executionModels !== undefined
			&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
		)
		&& matchEvmAddress(params.address)
	))
		error(404, 'Route mapping not applicable')

	const erc4337AccountFactoryEvmNetworkAddressSelector = parseEntitySelector(
		schema,
		Erc4337AccountFactorySchema,
		{
			$network: parentData.selector,
			address: params.address,
		},
		'EvmNetworkAddress'
	)
	if (erc4337AccountFactoryEvmNetworkAddressSelector instanceof arktype.errors)
		error(404, 'Invalid Erc4337AccountFactory selector')

	return {
		selector: erc4337AccountFactoryEvmNetworkAddressSelector,
	}
}
