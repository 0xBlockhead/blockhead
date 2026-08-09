// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import TezosContractSchema from '$/schema/TezosContract.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Tezos']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Tezos' && matchStringSegment(params.address)))
		error(404, 'Route mapping not applicable')

	const tezosContractNetworkAddressSelector = parseEntitySelector(
		schema,
		TezosContractSchema,
		{
			$network: parentData.selector,
			address: params.address,
		},
		'NetworkAddress'
	)
	if (tezosContractNetworkAddressSelector instanceof arktype.errors)
		error(404, 'Invalid TezosContract selector')

	return {
		selector: tezosContractNetworkAddressSelector,
	}
}
