// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CardanoConstitution_EpochSchema from '$/schema/CardanoConstitution_Epoch.ts'
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

	const cardanoConstitutionEpochNetworkEpochSourceSelector = parseEntitySelector(
		schema,
		CardanoConstitution_EpochSchema,
		{
			$network: parentData.selector,
			epoch: Number(params.epoch),
			source: params.source,
		},
		'NetworkEpochSource'
	)
	if (cardanoConstitutionEpochNetworkEpochSourceSelector instanceof arktype.errors)
		error(404, 'Invalid CardanoConstitution_Epoch selector')

	return {
		selector: cardanoConstitutionEpochNetworkEpochSourceSelector,
	}
}
