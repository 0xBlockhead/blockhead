// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import ZeroGDaQuorumSchema from '$/schema/ZeroGDaQuorum.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['ZeroG']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'ZeroG' && matchStringSegment(params.quorumId)))
		error(404, 'Route mapping not applicable')

	const zeroGDaQuorumNetworkQuorumIdSelector = parseEntitySelector(
		schema,
		ZeroGDaQuorumSchema,
		{
			$network: parentData.selector.$network,
			quorumId: params.quorumId,
		},
		'NetworkQuorumId'
	)
	if (zeroGDaQuorumNetworkQuorumIdSelector instanceof arktype.errors)
		error(404, 'Invalid ZeroGDaQuorum selector')

	return {
		selector: zeroGDaQuorumNetworkQuorumIdSelector,
	}
}
