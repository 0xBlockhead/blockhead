// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import LightningNodeSchema from '$/schema/LightningNode.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Lightning']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Lightning' && matchStringSegment(params.pubkey)))
		error(404, 'Route mapping not applicable')

	const lightningNodeNetworkPublicKeySelector = parseRouteEntitySelector(
		schema,
		LightningNodeSchema,
		{
			$network: parentData.selector,
			publicKey: params.pubkey,
		},
		'NetworkPublicKey'
	)
	if (lightningNodeNetworkPublicKeySelector instanceof arktype.errors)
		error(404, 'Invalid LightningNode selector')

	return {
		selector: lightningNodeNetworkPublicKeySelector,
	}
}
