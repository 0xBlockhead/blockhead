// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import TezosOperationSchema from '$/schema/TezosOperation.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Tezos']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Tezos' && matchNonNegativeInteger(params.contentIndex)))
		error(404, 'Route mapping not applicable')

	const tezosOperationOperationGroupContentIndexSelector = parseRouteEntitySelector(
		schema,
		TezosOperationSchema,
		{
			$operationGroup: parentData.selector,
			contentIndex: Number(params.contentIndex),
		},
		'OperationGroupContentIndex'
	)
	if (tezosOperationOperationGroupContentIndexSelector instanceof arktype.errors)
		error(404, 'Invalid TezosOperation selector')

	return {
		selector: tezosOperationOperationGroupContentIndexSelector,
	}
}
