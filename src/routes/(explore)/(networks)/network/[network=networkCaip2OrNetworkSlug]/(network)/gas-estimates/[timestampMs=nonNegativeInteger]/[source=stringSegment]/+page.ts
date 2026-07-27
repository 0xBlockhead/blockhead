// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmNetwork_GasEstimate_TimestampSchema from '$/schema/EvmNetwork_GasEstimate_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

	if (!((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')) && matchNonNegativeInteger(params.timestampMs) && matchStringSegment(params.source))) error(404, 'Route mapping not applicable')

	const evmNetworkGasEstimateTimestampNetworkTimestampMsSourceSelector = parseEntitySelector(
		schema,
		EvmNetwork_GasEstimate_TimestampSchema,
		{
			$network: parentData.selector,
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}
	)
	if (evmNetworkGasEstimateTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors) error(404, 'Invalid EvmNetwork_GasEstimate_Timestamp selector')

	return {
		selector: evmNetworkGasEstimateTimestampNetworkTimestampMsSourceSelector,
	}
}
