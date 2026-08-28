// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import TezosNetworkSchema from '$/schema/TezosNetwork.ts'
import TezosTokenSchema from '$/schema/TezosToken.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Tezos']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		parentData.projectionNetwork.namespace === 'Tezos'
		&& matchStringSegment(params.contractAddress)
		&& matchNonNegativeBigInt(params.tokenId)
	))
		error(404, 'Route mapping not applicable')

	const tezosNetworkNetworkParentSelector = parseRouteEntitySelector(
		schema,
		TezosNetworkSchema,
		parentData.selector,
		'Network'
	)
	if (tezosNetworkNetworkParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const tezosTokenNetworkContractAddressTokenIdSelector = parseRouteEntitySelector(
		schema,
		TezosTokenSchema,
		{
			$network: tezosNetworkNetworkParentSelector,
			contractAddress: params.contractAddress,
			tokenId: BigInt(params.tokenId),
		},
		'NetworkContractAddressTokenId'
	)
	if (tezosTokenNetworkContractAddressTokenIdSelector instanceof arktype.errors)
		error(404, 'Invalid TezosToken selector')

	return {
		selector: tezosTokenNetworkContractAddressTokenIdSelector,
	}
}
