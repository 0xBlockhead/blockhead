// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import HederaNetworkExchangeRate_TimestampSchema from '$/schema/HederaNetworkExchangeRate_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Hedera']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		parentData.projectionNetwork.namespace === 'Hedera'
		&& matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
	))
		error(404, 'Route mapping not applicable')

	const hederaNetworkExchangeRateTimestampNetworkTimestampMsSourceSelector = parseRouteEntitySelector(
		schema,
		HederaNetworkExchangeRate_TimestampSchema,
		{
			$network: parentData.selector.$network,
			timestampMs: Number(params.timestampMs),
			source: params.source,
		},
		'NetworkTimestampMsSource'
	)
	if (hederaNetworkExchangeRateTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors)
		error(404, 'Invalid HederaNetworkExchangeRate_Timestamp selector')

	return {
		selector: hederaNetworkExchangeRateTimestampNetworkTimestampMsSourceSelector,
	}
}
