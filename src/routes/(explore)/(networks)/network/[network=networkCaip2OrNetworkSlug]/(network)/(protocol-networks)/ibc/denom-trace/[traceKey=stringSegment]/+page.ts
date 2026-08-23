// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import IbcDenomTraceSchema from '$/schema/IbcDenomTrace.ts'
import { schema } from '$/schema/index.ts'
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
		&& matchStringSegment(params.traceKey)
	))
		error(404, 'Route mapping not applicable')

	const ibcDenomTraceNetworkTraceKeySelector = parseEntitySelector(
		schema,
		IbcDenomTraceSchema,
		{
			$network: parentData.selector.$network,
			traceKey: params.traceKey,
		},
		'NetworkTraceKey'
	)
	if (ibcDenomTraceNetworkTraceKeySelector instanceof arktype.errors)
		error(404, 'Invalid IbcDenomTrace selector')

	return {
		selector: ibcDenomTraceNetworkTraceKeySelector,
	}
}
