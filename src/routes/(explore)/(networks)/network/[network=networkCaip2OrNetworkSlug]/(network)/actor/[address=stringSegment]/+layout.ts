// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import FilecoinActorSchema from '$/schema/FilecoinActor.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Filecoin']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

	if (!(projectionNetwork.namespace === 'Filecoin' && matchStringSegment(params.address))) error(404, 'Route mapping not applicable')

	const filecoinActorNetworkAddressSelector = parseEntitySelector(
		schema,
		FilecoinActorSchema,
		{
			$network: parentData.selector,
			address: params.address,
		}
	)
	if (filecoinActorNetworkAddressSelector instanceof arktype.errors) error(404, 'Invalid FilecoinActor selector')

	return {
		selector: filecoinActorNetworkAddressSelector,
	}
}
