// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import NearReceiptSchema from '$/schema/NearReceipt.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Near']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Near' && matchStringSegment(params.receiptId)))
		error(404, 'Route mapping not applicable')

	const nearReceiptNetworkReceiptIdSelector = parseRouteEntitySelector(
		schema,
		NearReceiptSchema,
		{
			$network: parentData.selector,
			receiptId: params.receiptId,
		},
		'NetworkReceiptId'
	)
	if (nearReceiptNetworkReceiptIdSelector instanceof arktype.errors)
		error(404, 'Invalid NearReceipt selector')

	return {
		selector: nearReceiptNetworkReceiptIdSelector,
	}
}
