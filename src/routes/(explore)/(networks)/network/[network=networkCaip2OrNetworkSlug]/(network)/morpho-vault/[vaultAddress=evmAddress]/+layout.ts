// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import MorphoVaultSchema from '$/schema/MorphoVault.ts'
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
		&& matchEvmAddress(params.vaultAddress)
	))
		error(404, 'Route mapping not applicable')

	const morphoVaultNetworkVaultAddressSelector = parseRouteEntitySelector(
		schema,
		MorphoVaultSchema,
		{
			$network: parentData.selector,
			vaultAddress: params.vaultAddress,
		},
		'NetworkVaultAddress'
	)
	if (morphoVaultNetworkVaultAddressSelector instanceof arktype.errors)
		error(404, 'Invalid MorphoVault selector')

	return {
		selector: morphoVaultNetworkVaultAddressSelector,
	}
}
