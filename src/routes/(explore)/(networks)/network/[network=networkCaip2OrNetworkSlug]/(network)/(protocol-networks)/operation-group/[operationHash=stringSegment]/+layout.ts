// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import TezosOperationGroupSchema from '$/schema/TezosOperationGroup.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Tezos']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Tezos' && matchStringSegment(params.operationHash)))
		error(404, 'Route mapping not applicable')

	const tezosOperationGroupNetworkOperationHashSelector = parseEntitySelector(
		schema,
		TezosOperationGroupSchema,
		{
			$network: parentData.selector,
			operationHash: params.operationHash,
		},
		'NetworkOperationHash'
	)
	if (tezosOperationGroupNetworkOperationHashSelector instanceof arktype.errors)
		error(404, 'Invalid TezosOperationGroup selector')

	return {
		selector: tezosOperationGroupNetworkOperationHashSelector,
	}
}
