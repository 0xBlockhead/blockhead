// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import XrplTrustlineSchema from '$/schema/XrplTrustline.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Xrpl']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

	if (!(projectionNetwork.namespace === 'Xrpl' && matchStringSegment(params.account) && matchStringSegment(params.currency) && matchStringSegment(params.issuer))) error(404, 'Route mapping not applicable')

	const xrplTrustlineNetworkAccountCurrencyIssuerSelector = parseEntitySelector(
		schema,
		XrplTrustlineSchema,
		{
			$network: parentData.selector,
			account: params.account,
			currency: params.currency,
			issuer: params.issuer,
		}
	)
	if (xrplTrustlineNetworkAccountCurrencyIssuerSelector instanceof arktype.errors) error(404, 'Invalid XrplTrustline selector')

	return {
		selector: xrplTrustlineNetworkAccountCurrencyIssuerSelector,
	}
}
