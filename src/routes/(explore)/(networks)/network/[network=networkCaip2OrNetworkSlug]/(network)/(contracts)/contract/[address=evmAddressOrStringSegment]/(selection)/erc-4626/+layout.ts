// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import Erc4626VaultSchema from '$/schema/Erc4626Vault.ts'
import EvmContractSchema from '$/schema/EvmContract.ts'
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
	))
		error(404, 'Route mapping not applicable')

	const evmContractEvmNetworkAddressParentSelector = parseRouteEntitySelector(
		schema,
		EvmContractSchema,
		parentData.selector,
		'EvmNetworkAddress'
	)
	if (evmContractEvmNetworkAddressParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const erc4626VaultContractSelector = parseRouteEntitySelector(
		schema,
		Erc4626VaultSchema,
		{
			$contract: evmContractEvmNetworkAddressParentSelector,
		},
		'Contract'
	)
	if (erc4626VaultContractSelector instanceof arktype.errors)
		error(404, 'Invalid Erc4626Vault selector')

	return {
		selector: erc4626VaultContractSelector,
	}
}
