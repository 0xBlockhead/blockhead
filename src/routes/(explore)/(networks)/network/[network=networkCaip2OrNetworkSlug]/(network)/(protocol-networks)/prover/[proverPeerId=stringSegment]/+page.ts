// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import QuilibriumProverSchema from '$/schema/QuilibriumProver.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Quilibrium']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Quilibrium' && matchStringSegment(params.proverPeerId)))
		error(404, 'Route mapping not applicable')

	const quilibriumProverNetworkProverPeerIdSelector = parseEntitySelector(
		schema,
		QuilibriumProverSchema,
		{
			$network: parentData.selector.$network,
			proverPeerId: params.proverPeerId,
		},
		'NetworkProverPeerId'
	)
	if (quilibriumProverNetworkProverPeerIdSelector instanceof arktype.errors)
		error(404, 'Invalid QuilibriumProver selector')

	return {
		selector: quilibriumProverNetworkProverPeerIdSelector,
	}
}
