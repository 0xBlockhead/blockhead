// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CardanoGovernanceProposalSchema from '$/schema/CardanoGovernanceProposal.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Cardano']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		parentData.projectionNetwork.namespace === 'Cardano'
		&& matchStringSegment(params.proposalTxHash)
		&& matchNonNegativeInteger(params.proposalIndex)
	))
		error(404, 'Route mapping not applicable')

	const cardanoGovernanceProposalNetworkProposalTxHashProposalIndexSelector = parseEntitySelector(
		schema,
		CardanoGovernanceProposalSchema,
		{
			$network: parentData.selector,
			proposalTxHash: params.proposalTxHash,
			proposalIndex: Number(params.proposalIndex),
		},
		'NetworkProposalTxHashProposalIndex'
	)
	if (cardanoGovernanceProposalNetworkProposalTxHashProposalIndexSelector instanceof arktype.errors)
		error(404, 'Invalid CardanoGovernanceProposal selector')

	return {
		selector: cardanoGovernanceProposalNetworkProposalTxHashProposalIndexSelector,
	}
}
