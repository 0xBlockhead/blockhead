// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import OsmosisPositionSchema from '$/schema/OsmosisPosition.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Cosmos']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			(
				parentData.projectionNetwork.executionModels !== undefined
				&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'CosmosSdk')
			)
			&& parentData.projectionNetwork.namespace === 'Cosmos'
		)
		&& matchStringSegment(params.positionId)
	))
		error(404, 'Route mapping not applicable')

	const osmosisPositionNetworkPositionIdSelector = parseEntitySelector(
		schema,
		OsmosisPositionSchema,
		{
			$network: parentData.selector,
			positionId: params.positionId,
		},
		'NetworkPositionId'
	)
	if (osmosisPositionNetworkPositionIdSelector instanceof arktype.errors)
		error(404, 'Invalid OsmosisPosition selector')

	return {
		selector: osmosisPositionNetworkPositionIdSelector,
	}
}
