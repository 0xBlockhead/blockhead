// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import HyperliquidVaultSchema from '$/schema/HyperliquidVault.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Hyperliquid']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Hyperliquid' && matchEvmAddress(params.vaultAddress)))
		error(404, 'Route mapping not applicable')

	const hyperliquidVaultNetworkVaultAddressSelector = parseEntitySelector(
		schema,
		HyperliquidVaultSchema,
		{
			$network: parentData.selector.$network,
			vaultAddress: params.vaultAddress,
		},
		'NetworkVaultAddress'
	)
	if (hyperliquidVaultNetworkVaultAddressSelector instanceof arktype.errors)
		error(404, 'Invalid HyperliquidVault selector')

	return {
		selector: hyperliquidVaultNetworkVaultAddressSelector,
	}
}
