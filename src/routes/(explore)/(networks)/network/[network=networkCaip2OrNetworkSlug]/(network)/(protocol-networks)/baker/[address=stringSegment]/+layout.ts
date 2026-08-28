// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import TezosBakerSchema from '$/schema/TezosBaker.ts'
import TezosNetworkSchema from '$/schema/TezosNetwork.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Tezos']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Tezos' && matchStringSegment(params.address)))
		error(404, 'Route mapping not applicable')

	const tezosNetworkNetworkParentSelector = parseRouteEntitySelector(
		schema,
		TezosNetworkSchema,
		parentData.selector,
		'Network'
	)
	if (tezosNetworkNetworkParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const tezosBakerNetworkAddressSelector = parseRouteEntitySelector(
		schema,
		TezosBakerSchema,
		{
			$network: tezosNetworkNetworkParentSelector,
			address: params.address,
		},
		'NetworkAddress'
	)
	if (tezosBakerNetworkAddressSelector instanceof arktype.errors)
		error(404, 'Invalid TezosBaker selector')

	return {
		selector: tezosBakerNetworkAddressSelector,
	}
}
