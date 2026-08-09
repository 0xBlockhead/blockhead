// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import ScalingDeploymentClaimSchema from '$/schema/ScalingDeploymentClaim.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.claimSource) && matchStringSegment(params.sourceProjectId)))
		error(404, 'Route mapping not applicable')

	const scalingDeploymentClaimNetworkSourceSourceProjectIdSelector = parseEntitySelector(
		schema,
		ScalingDeploymentClaimSchema,
		{
			$network: parentData.selector,
			source: params.claimSource,
			sourceProjectId: params.sourceProjectId,
		},
		'NetworkSourceSourceProjectId'
	)
	if (scalingDeploymentClaimNetworkSourceSourceProjectIdSelector instanceof arktype.errors)
		error(404, 'Invalid ScalingDeploymentClaim selector')

	return {
		selector: scalingDeploymentClaimNetworkSourceSourceProjectIdSelector,
	}
}
