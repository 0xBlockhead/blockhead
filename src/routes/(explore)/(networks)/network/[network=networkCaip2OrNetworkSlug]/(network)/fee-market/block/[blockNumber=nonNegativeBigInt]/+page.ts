// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmNetwork_GasFee_BlockSchema from '$/schema/EvmNetwork_GasFee_Block.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

	if (!((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')) && matchNonNegativeBigInt(params.blockNumber))) error(404, 'Route mapping not applicable')

	const evmNetworkGasFeeBlockEvmNetworkBlockNumberSelector = parseEntitySelector(
		schema,
		EvmNetwork_GasFee_BlockSchema,
		{
			$network: parentData.selector,
			blockNumber: BigInt(params.blockNumber),
		}
	)
	if (evmNetworkGasFeeBlockEvmNetworkBlockNumberSelector instanceof arktype.errors) error(404, 'Invalid EvmNetwork_GasFee_Block selector')

	return {
		selector: evmNetworkGasFeeBlockEvmNetworkBlockNumberSelector,
	}
}
