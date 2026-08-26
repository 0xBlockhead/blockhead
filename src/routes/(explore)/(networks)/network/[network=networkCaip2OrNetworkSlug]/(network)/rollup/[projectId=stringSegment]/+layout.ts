// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import EvmRollupSchema from '$/schema/EvmRollup.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			parentData.projectionNetwork.executionModels !== undefined
			&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
		)
		&& matchStringSegment(params.projectId)
	))
		error(404, 'Route mapping not applicable')

	const evmRollupEvmNetworkProjectIdSelector = parseRouteEntitySelector(
		schema,
		EvmRollupSchema,
		{
			$network: parentData.selector,
			projectId: params.projectId,
		},
		'EvmNetworkProjectId'
	)
	if (evmRollupEvmNetworkProjectIdSelector instanceof arktype.errors)
		error(404, 'Invalid EvmRollup selector')

	return {
		selector: evmRollupEvmNetworkProjectIdSelector,
	}
}
