// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import QuilibriumFrameSchema from '$/schema/QuilibriumFrame.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Quilibrium']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		parentData.projectionNetwork.namespace === 'Quilibrium'
		&& matchNonNegativeBigInt(params.frameNumber)
		&& matchStringSegment(params.shardKey)
	))
		error(404, 'Route mapping not applicable')

	const quilibriumFrameNetworkFrameNumberShardKeySelector = parseEntitySelector(
		schema,
		QuilibriumFrameSchema,
		{
			$network: parentData.selector,
			frameNumber: BigInt(params.frameNumber),
			shardKey: params.shardKey,
		},
		'NetworkFrameNumberShardKey'
	)
	if (quilibriumFrameNetworkFrameNumberShardKeySelector instanceof arktype.errors)
		error(404, 'Invalid QuilibriumFrame selector')

	return {
		selector: quilibriumFrameNetworkFrameNumberShardKeySelector,
	}
}
