// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmNetwork_GasEstimate_TimestampSchema from '$/schema/EvmNetwork_GasEstimate_Timestamp.ts'
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
		&& matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
	))
		error(404, 'Route mapping not applicable')

	const evmNetworkGasEstimateTimestampNetworkTimestampMsSourceSelector = parseEntitySelector(
		schema,
		EvmNetwork_GasEstimate_TimestampSchema,
		{
			$network: parentData.selector,
			timestampMs: Number(params.timestampMs),
			source: params.source,
		},
		'NetworkTimestampMsSource'
	)
	if (evmNetworkGasEstimateTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors)
		error(404, 'Invalid EvmNetwork_GasEstimate_Timestamp selector')

	return {
		selector: evmNetworkGasEstimateTimestampNetworkTimestampMsSourceSelector,
	}
}
