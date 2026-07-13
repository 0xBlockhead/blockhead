// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { BlockheadLightningPayment as BlockheadLightningPaymentSchema } from '$/schema/BlockheadLightningPayment.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Lightning']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

	if (!(projectionNetwork.namespace === 'Lightning' && matchStringSegment(params.paymentHash))) error(404, 'Route mapping not applicable')

	const blockheadLightningPaymentNetworkPaymentHashSelector = parseEntitySelector(
		schema,
		BlockheadLightningPaymentSchema,
		{
			$network: parentData.selector,
			paymentHash: params.paymentHash,
		}
	)
	if (blockheadLightningPaymentNetworkPaymentHashSelector instanceof arktype.errors) error(404, 'Invalid BlockheadLightningPayment selector')

	return {
		selector: blockheadLightningPaymentNetworkPaymentHashSelector,
	}
}
