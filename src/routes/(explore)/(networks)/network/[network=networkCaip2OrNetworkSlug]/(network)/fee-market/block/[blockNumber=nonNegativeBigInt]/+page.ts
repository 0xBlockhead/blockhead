// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import EvmNetwork_GasFee_BlockSchema from '$/schema/EvmNetwork_GasFee_Block.ts'
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
		&& matchNonNegativeBigInt(params.blockNumber)
	))
		error(404, 'Route mapping not applicable')

	const evmNetworkGasFeeBlockEvmNetworkBlockNumberSelector = parseRouteEntitySelector(
		schema,
		EvmNetwork_GasFee_BlockSchema,
		{
			$network: parentData.selector,
			blockNumber: BigInt(params.blockNumber),
		},
		'EvmNetworkBlockNumber'
	)
	if (evmNetworkGasFeeBlockEvmNetworkBlockNumberSelector instanceof arktype.errors)
		error(404, 'Invalid EvmNetwork_GasFee_Block selector')

	return {
		selector: evmNetworkGasFeeBlockEvmNetworkBlockNumberSelector,
	}
}
