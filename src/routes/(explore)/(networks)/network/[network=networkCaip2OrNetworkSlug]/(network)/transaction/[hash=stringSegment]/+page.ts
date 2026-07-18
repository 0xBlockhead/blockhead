// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { XrplTransaction as XrplTransactionSchema } from '$/schema/XrplTransaction.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Xrpl']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

	if (!((projectionNetwork.namespace === 'Xrpl' && projectionNetwork.namespace === 'Xrpl') && matchStringSegment(params.hash))) error(404, 'Route mapping not applicable')

	const xrplTransactionNetworkHashSelector = parseEntitySelector(
		schema,
		XrplTransactionSchema,
		{
			$network: parentData.selector,
			hash: params.hash,
		}
	)
	if (xrplTransactionNetworkHashSelector instanceof arktype.errors) error(404, 'Invalid XrplTransaction selector')

	return {
		selector: xrplTransactionNetworkHashSelector,
	}
}
