// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import CardanoProtocolParameters_EpochSchema from '$/schema/CardanoProtocolParameters_Epoch.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Cardano']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		parentData.projectionNetwork.namespace === 'Cardano'
		&& matchStringSegment(params.source)
		&& matchNonNegativeInteger(params.epoch)
	))
		error(404, 'Route mapping not applicable')

	const cardanoProtocolParametersEpochNetworkEpochSourceSelector = parseRouteEntitySelector(
		schema,
		CardanoProtocolParameters_EpochSchema,
		{
			$network: parentData.selector,
			epoch: Number(params.epoch),
			source: params.source,
		},
		'NetworkEpochSource'
	)
	if (cardanoProtocolParametersEpochNetworkEpochSourceSelector instanceof arktype.errors)
		error(404, 'Invalid CardanoProtocolParameters_Epoch selector')

	return {
		selector: cardanoProtocolParametersEpochNetworkEpochSourceSelector,
	}
}
