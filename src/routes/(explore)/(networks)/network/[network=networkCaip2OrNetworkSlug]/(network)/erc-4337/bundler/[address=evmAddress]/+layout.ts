// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import Erc4337BundlerSchema from '$/schema/Erc4337Bundler.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

	if (!((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')) && matchEvmAddress(params.address))) error(404, 'Route mapping not applicable')

	const erc4337BundlerEvmNetworkAddressSelector = parseEntitySelector(
		schema,
		Erc4337BundlerSchema,
		{
			$network: parentData.selector,
			address: params.address,
		}
	)
	if (erc4337BundlerEvmNetworkAddressSelector instanceof arktype.errors) error(404, 'Invalid Erc4337Bundler selector')

	return {
		selector: erc4337BundlerEvmNetworkAddressSelector,
	}
}
