// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import PolkadotReferendumSchema from '$/schema/PolkadotReferendum.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Polkadot']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			(
				parentData.projectionNetwork.executionModels !== undefined
				&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'PolkadotRuntime')
			)
			&& parentData.projectionNetwork.namespace === 'Polkadot'
		)
		&& matchStringSegment(params.referendumId)
	))
		error(404, 'Route mapping not applicable')

	const polkadotReferendumNetworkReferendumIdSelector = parseEntitySelector(
		schema,
		PolkadotReferendumSchema,
		{
			$network: parentData.selector,
			referendumId: params.referendumId,
		},
		'NetworkReferendumId'
	)
	if (polkadotReferendumNetworkReferendumIdSelector instanceof arktype.errors)
		error(404, 'Invalid PolkadotReferendum selector')

	return {
		selector: polkadotReferendumNetworkReferendumIdSelector,
	}
}
