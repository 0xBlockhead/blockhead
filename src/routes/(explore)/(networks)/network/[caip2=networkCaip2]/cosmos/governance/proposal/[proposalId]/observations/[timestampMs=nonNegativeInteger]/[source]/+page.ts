// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CosmosGovernanceProposal_TimestampSchema from '$/schema/CosmosGovernanceProposal_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const cosmosGovernanceProposalTimestampSelector = parseEntitySelector(
		schema,
		CosmosGovernanceProposal_TimestampSchema,
		{
			$proposal: {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				proposalId: decodeURIComponent(params.proposalId),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (cosmosGovernanceProposalTimestampSelector instanceof arktype.errors) error(404, 'Invalid CosmosGovernanceProposal_Timestamp selector')

	return {
		selector: cosmosGovernanceProposalTimestampSelector,
	}
}
