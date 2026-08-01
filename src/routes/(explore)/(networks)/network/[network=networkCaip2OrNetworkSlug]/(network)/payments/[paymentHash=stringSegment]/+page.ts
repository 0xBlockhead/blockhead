// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadLightningPaymentSchema from '$/schema/BlockheadLightningPayment.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Lightning']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Lightning' && matchStringSegment(params.paymentHash)))
		error(404, 'Route mapping not applicable')

	const blockheadLightningPaymentNetworkPaymentHashSelector = parseEntitySelector(
		schema,
		BlockheadLightningPaymentSchema,
		{
			$network: parentData.selector,
			paymentHash: params.paymentHash,
		},
		'NetworkPaymentHash'
	)
	if (blockheadLightningPaymentNetworkPaymentHashSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadLightningPayment selector')

	return {
		selector: blockheadLightningPaymentNetworkPaymentHashSelector,
	}
}
