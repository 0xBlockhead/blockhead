// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import XrplTransactionSchema from '$/schema/XrplTransaction.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Xrpl']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Xrpl' && matchStringSegment(params.hash)))
		error(404, 'Route mapping not applicable')

	const xrplTransactionNetworkHashSelector = parseEntitySelector(
		schema,
		XrplTransactionSchema,
		{
			$network: parentData.selector,
			hash: params.hash,
		},
		'NetworkHash'
	)
	if (xrplTransactionNetworkHashSelector instanceof arktype.errors)
		error(404, 'Invalid XrplTransaction selector')

	return {
		selector: xrplTransactionNetworkHashSelector,
	}
}
