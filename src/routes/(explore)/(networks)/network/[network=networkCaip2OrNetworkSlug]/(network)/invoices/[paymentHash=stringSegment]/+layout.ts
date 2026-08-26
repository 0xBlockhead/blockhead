// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadLightningInvoiceSchema from '$/schema/BlockheadLightningInvoice.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Lightning']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Lightning' && matchStringSegment(params.paymentHash)))
		error(404, 'Route mapping not applicable')

	const blockheadLightningInvoiceNetworkPaymentHashSelector = parseRouteEntitySelector(
		schema,
		BlockheadLightningInvoiceSchema,
		{
			$network: parentData.selector,
			paymentHash: params.paymentHash,
		},
		'NetworkPaymentHash'
	)
	if (blockheadLightningInvoiceNetworkPaymentHashSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadLightningInvoice selector')

	return {
		selector: blockheadLightningInvoiceNetworkPaymentHashSelector,
	}
}
