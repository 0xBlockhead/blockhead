// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SnapshotProposalSchema from '$/schema/SnapshotProposal.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.proposalId)))
		error(404, 'Route mapping not applicable')

	const snapshotProposalProposalIdSelector = parseRouteEntitySelector(
		schema,
		SnapshotProposalSchema,
		{
			proposalId: decodeURIComponent(params.proposalId),
		},
		'ProposalId'
	)
	if (snapshotProposalProposalIdSelector instanceof arktype.errors)
		error(404, 'Invalid SnapshotProposal selector')

	return {
		selector: snapshotProposalProposalIdSelector,
	}
}
