// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import A2aAgentCard_SnapshotSchema from '$/schema/A2aAgentCard_Snapshot.ts'
import A2aAgentCardSchema from '$/schema/A2aAgentCard.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.contentHashAlgorithm) && matchZeroExHex(params.contentHash)))
		error(404, 'Route mapping not applicable')

	const a2aAgentCardAgentCardUrlParentSelector = parseRouteEntitySelector(
		schema,
		A2aAgentCardSchema,
		parentData.selector,
		'AgentCardUrl'
	)
	if (a2aAgentCardAgentCardUrlParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const a2aAgentCardSnapshotCardContentHashSelector = parseRouteEntitySelector(
		schema,
		A2aAgentCard_SnapshotSchema,
		{
			$card: a2aAgentCardAgentCardUrlParentSelector,
			contentHashAlgorithm: params.contentHashAlgorithm,
			contentHash: params.contentHash,
		},
		'CardContentHash'
	)
	if (a2aAgentCardSnapshotCardContentHashSelector instanceof arktype.errors)
		error(404, 'Invalid A2aAgentCard_Snapshot selector')

	return {
		selector: a2aAgentCardSnapshotCardContentHashSelector,
	}
}
