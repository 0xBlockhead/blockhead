// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CosmosGovernanceProposalSchema from '$/schema/CosmosGovernanceProposal.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.proposalId)))
		error(404, 'Route mapping not applicable')

	const cosmosGovernanceProposalNetworkProposalIdSelector = parseEntitySelector(
		schema,
		CosmosGovernanceProposalSchema,
		{
			$network: parentData.selector,
			proposalId: params.proposalId,
		},
		'NetworkProposalId'
	)
	if (cosmosGovernanceProposalNetworkProposalIdSelector instanceof arktype.errors)
		error(404, 'Invalid CosmosGovernanceProposal selector')

	return {
		selector: cosmosGovernanceProposalNetworkProposalIdSelector,
	}
}
