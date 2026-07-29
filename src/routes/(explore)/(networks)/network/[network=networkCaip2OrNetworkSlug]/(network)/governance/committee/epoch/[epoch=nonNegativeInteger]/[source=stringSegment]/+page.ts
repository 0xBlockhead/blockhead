// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CardanoCommittee_EpochSchema from '$/schema/CardanoCommittee_Epoch.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Cardano']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		parentData.projectionNetwork.namespace === 'Cardano'
		&& matchNonNegativeInteger(params.epoch)
		&& matchStringSegment(params.source)
	))
		error(404, 'Route mapping not applicable')

	const cardanoCommitteeEpochNetworkEpochSourceSelector = parseEntitySelector(
		schema,
		CardanoCommittee_EpochSchema,
		{
			$network: parentData.selector,
			epoch: Number(params.epoch),
			source: params.source,
		}
	)
	if (cardanoCommitteeEpochNetworkEpochSourceSelector instanceof arktype.errors)
		error(404, 'Invalid CardanoCommittee_Epoch selector')

	return {
		selector: cardanoCommitteeEpochNetworkEpochSourceSelector,
	}
}
