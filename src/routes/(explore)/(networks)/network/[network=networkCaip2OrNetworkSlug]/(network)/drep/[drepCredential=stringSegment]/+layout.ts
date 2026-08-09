// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CardanoDRepSchema from '$/schema/CardanoDRep.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Cardano']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Cardano' && matchStringSegment(params.drepCredential)))
		error(404, 'Route mapping not applicable')

	const cardanoDRepNetworkDrepCredentialSelector = parseEntitySelector(
		schema,
		CardanoDRepSchema,
		{
			$network: parentData.selector,
			drepCredential: params.drepCredential,
		},
		'NetworkDrepCredential'
	)
	if (cardanoDRepNetworkDrepCredentialSelector instanceof arktype.errors)
		error(404, 'Invalid CardanoDRep selector')

	return {
		selector: cardanoDRepNetworkDrepCredentialSelector,
	}
}
