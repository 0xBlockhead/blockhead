// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import ZeroGStorageLogEntrySchema from '$/schema/ZeroGStorageLogEntry.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['ZeroG']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'ZeroG' && matchStringSegment(params.logEntryId)))
		error(404, 'Route mapping not applicable')

	const zeroGStorageLogEntryNetworkLogEntryIdSelector = parseEntitySelector(
		schema,
		ZeroGStorageLogEntrySchema,
		{
			$network: parentData.selector.$network,
			logEntryId: params.logEntryId,
		},
		'NetworkLogEntryId'
	)
	if (zeroGStorageLogEntryNetworkLogEntryIdSelector instanceof arktype.errors)
		error(404, 'Invalid ZeroGStorageLogEntry selector')

	return {
		selector: zeroGStorageLogEntryNetworkLogEntryIdSelector,
	}
}
