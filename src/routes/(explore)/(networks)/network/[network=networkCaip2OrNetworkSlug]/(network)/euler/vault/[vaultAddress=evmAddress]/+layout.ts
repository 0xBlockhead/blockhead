// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import EulerEvkVaultSchema from '$/schema/EulerEvkVault.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchEvmAddress(params.vaultAddress)))
		error(404, 'Route mapping not applicable')

	const eulerEvkVaultNetworkVaultAddressSelector = parseRouteEntitySelector(
		schema,
		EulerEvkVaultSchema,
		{
			$network: parentData.selector,
			vaultAddress: params.vaultAddress,
		},
		'NetworkVaultAddress'
	)
	if (eulerEvkVaultNetworkVaultAddressSelector instanceof arktype.errors)
		error(404, 'Invalid EulerEvkVault selector')

	return {
		selector: eulerEvkVaultNetworkVaultAddressSelector,
	}
}
