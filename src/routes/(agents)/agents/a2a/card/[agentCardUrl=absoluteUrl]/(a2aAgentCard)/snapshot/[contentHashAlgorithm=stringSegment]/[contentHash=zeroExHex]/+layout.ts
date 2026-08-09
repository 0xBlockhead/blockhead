// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import A2aAgentCard_SnapshotSchema from '$/schema/A2aAgentCard_Snapshot.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.contentHashAlgorithm) && matchZeroExHex(params.contentHash)))
		error(404, 'Route mapping not applicable')

	const a2aAgentCardSnapshotCardContentHashSelector = parseEntitySelector(
		schema,
		A2aAgentCard_SnapshotSchema,
		{
			$card: parentData.selector,
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
