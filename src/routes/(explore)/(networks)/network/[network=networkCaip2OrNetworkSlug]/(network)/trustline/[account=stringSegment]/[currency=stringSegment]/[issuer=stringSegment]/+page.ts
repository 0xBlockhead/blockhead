// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import XrplTrustlineSchema from '$/schema/XrplTrustline.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Xrpl']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		parentData.projectionNetwork.namespace === 'Xrpl'
		&& matchStringSegment(params.account)
		&& matchStringSegment(params.currency)
		&& matchStringSegment(params.issuer)
	))
		error(404, 'Route mapping not applicable')

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
	if (xrplTrustlineNetworkAccountCurrencyIssuerSelector instanceof arktype.errors)
		error(404, 'Invalid XrplTrustline selector')

	return {
		selector: xrplTrustlineNetworkAccountCurrencyIssuerSelector,
	}
}
