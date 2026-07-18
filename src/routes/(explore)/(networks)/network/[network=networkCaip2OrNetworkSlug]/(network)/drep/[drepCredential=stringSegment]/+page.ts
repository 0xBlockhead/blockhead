// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { CardanoDRep as CardanoDRepSchema } from '$/schema/CardanoDRep.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Cardano']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

	if (!(projectionNetwork.namespace === 'Cardano' && matchStringSegment(params.drepCredential))) error(404, 'Route mapping not applicable')

	const cardanoDRepNetworkDrepCredentialSelector = parseEntitySelector(
		schema,
		CardanoDRepSchema,
		{
			$network: parentData.selector,
			drepCredential: params.drepCredential,
		}
	)
	if (cardanoDRepNetworkDrepCredentialSelector instanceof arktype.errors) error(404, 'Invalid CardanoDRep selector')

	return {
		selector: cardanoDRepNetworkDrepCredentialSelector,
	}
}
