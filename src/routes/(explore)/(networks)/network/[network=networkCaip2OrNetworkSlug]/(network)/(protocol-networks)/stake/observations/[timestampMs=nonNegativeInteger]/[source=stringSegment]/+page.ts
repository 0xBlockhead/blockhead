// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import HederaNetworkStake_TimestampSchema from '$/schema/HederaNetworkStake_Timestamp.ts'
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

	const hederaNetworkStakeTimestampNetworkTimestampMsSourceSelector = parseEntitySelector(
		schema,
		HederaNetworkStake_TimestampSchema,
		{
			$network: parentData.selector,
			timestampMs: Number(params.timestampMs),
			source: params.source,
		},
		'NetworkTimestampMsSource'
	)
	if (hederaNetworkStakeTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors)
		error(404, 'Invalid HederaNetworkStake_Timestamp selector')

	return {
		selector: hederaNetworkStakeTimestampNetworkTimestampMsSourceSelector,
	}
}
