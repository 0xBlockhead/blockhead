// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadCodexStoredDataSchema from '$/schema/BlockheadCodexStoredData.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.cid)))
		error(404, 'Route mapping not applicable')

	const blockheadCodexStoredDataNodeStateCidSelector = parseRouteEntitySelector(
		schema,
		BlockheadCodexStoredDataSchema,
		{
			$nodeState: parentData.selector,
			cid: params.cid,
		},
		'NodeStateCid'
	)
	if (blockheadCodexStoredDataNodeStateCidSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadCodexStoredData selector')

	return {
		selector: blockheadCodexStoredDataNodeStateCidSelector,
	}
}
