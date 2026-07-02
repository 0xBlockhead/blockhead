// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CosmosGovernanceProposalSchema from '$/schema/CosmosGovernanceProposal.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const cosmosGovernanceProposalSelector = parseEntitySelector(
		schema,
		CosmosGovernanceProposalSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			proposalId: decodeURIComponent(params.proposalId),
		}
	)
	if (cosmosGovernanceProposalSelector instanceof arktype.errors) error(404, 'Invalid CosmosGovernanceProposal selector')

	return {
		selector: cosmosGovernanceProposalSelector,
	}
}
