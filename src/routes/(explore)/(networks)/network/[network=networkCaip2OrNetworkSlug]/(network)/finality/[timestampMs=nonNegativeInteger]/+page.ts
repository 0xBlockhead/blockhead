// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EthereumBeaconFinality_TimestampSchema from '$/schema/EthereumBeaconFinality_Timestamp.ts'
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
	))
		error(404, 'Route mapping not applicable')

	const ethereumBeaconFinalityTimestampEvmNetworkTimestampMsSelector = parseEntitySelector(
		schema,
		EthereumBeaconFinality_TimestampSchema,
		{
			$network: parentData.selector,
			timestampMs: Number(params.timestampMs),
		}
	)
	if (ethereumBeaconFinalityTimestampEvmNetworkTimestampMsSelector instanceof arktype.errors)
		error(404, 'Invalid EthereumBeaconFinality_Timestamp selector')

	return {
		selector: ethereumBeaconFinalityTimestampEvmNetworkTimestampMsSelector,
	}
}
