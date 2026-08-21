// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import TallyProposalSchema from '$/schema/TallyProposal.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.proposalId)))
		error(404, 'Route mapping not applicable')

	const tallyProposalProposalIdSelector = parseEntitySelector(
		schema,
		TallyProposalSchema,
		{
			proposalId: decodeURIComponent(params.proposalId),
		},
		'ProposalId'
	)
	if (tallyProposalProposalIdSelector instanceof arktype.errors)
		error(404, 'Invalid TallyProposal selector')

	return {
		selector: tallyProposalProposalIdSelector,
	}
}
