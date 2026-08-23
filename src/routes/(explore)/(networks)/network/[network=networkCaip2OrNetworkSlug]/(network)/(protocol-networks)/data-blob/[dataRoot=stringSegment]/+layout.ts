// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import ZeroGDataBlobSchema from '$/schema/ZeroGDataBlob.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['ZeroG']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'ZeroG' && matchStringSegment(params.dataRoot)))
		error(404, 'Route mapping not applicable')

	const zeroGDataBlobNetworkDataRootSelector = parseEntitySelector(
		schema,
		ZeroGDataBlobSchema,
		{
			$network: parentData.selector.$network,
			dataRoot: params.dataRoot,
		},
		'NetworkDataRoot'
	)
	if (zeroGDataBlobNetworkDataRootSelector instanceof arktype.errors)
		error(404, 'Invalid ZeroGDataBlob selector')

	return {
		selector: zeroGDataBlobNetworkDataRootSelector,
	}
}
