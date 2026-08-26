// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadLocalMediaIngestSchema from '$/schema/BlockheadLocalMediaIngest.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.ingestId)))
		error(404, 'Route mapping not applicable')

	const blockheadLocalMediaIngestIngestIdSelector = parseRouteEntitySelector(
		schema,
		BlockheadLocalMediaIngestSchema,
		{
			ingestId: params.ingestId,
		},
		'IngestId'
	)
	if (blockheadLocalMediaIngestIngestIdSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadLocalMediaIngest selector')

	return {
		selector: blockheadLocalMediaIngestIngestIdSelector,
	}
}
