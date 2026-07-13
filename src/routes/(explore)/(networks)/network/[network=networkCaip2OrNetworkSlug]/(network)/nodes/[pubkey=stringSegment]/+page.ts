// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { LightningNode as LightningNodeSchema } from '$/schema/LightningNode.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Lightning']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

	if (!(projectionNetwork.namespace === 'Lightning' && matchStringSegment(params.pubkey))) error(404, 'Route mapping not applicable')

	const lightningNodeNetworkPublicKeySelector = parseEntitySelector(
		schema,
		LightningNodeSchema,
		{
			$network: parentData.selector,
			publicKey: params.pubkey,
		}
	)
	if (lightningNodeNetworkPublicKeySelector instanceof arktype.errors) error(404, 'Invalid LightningNode selector')

	return {
		selector: lightningNodeNetworkPublicKeySelector,
	}
}
