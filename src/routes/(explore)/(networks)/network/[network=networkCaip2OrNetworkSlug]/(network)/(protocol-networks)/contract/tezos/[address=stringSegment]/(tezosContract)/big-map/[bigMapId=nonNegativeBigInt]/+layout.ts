// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import TezosBigMapSchema from '$/schema/TezosBigMap.ts'
import TezosContractSchema from '$/schema/TezosContract.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Tezos']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Tezos' && matchNonNegativeBigInt(params.bigMapId)))
		error(404, 'Route mapping not applicable')

	const tezosContractNetworkAddressParentSelector = parseRouteEntitySelector(
		schema,
		TezosContractSchema,
		parentData.selector,
		'NetworkAddress'
	)
	if (tezosContractNetworkAddressParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const tezosBigMapContractBigMapIdSelector = parseRouteEntitySelector(
		schema,
		TezosBigMapSchema,
		{
			$contract: tezosContractNetworkAddressParentSelector,
			bigMapId: BigInt(params.bigMapId),
		},
		'ContractBigMapId'
	)
	if (tezosBigMapContractBigMapIdSelector instanceof arktype.errors)
		error(404, 'Invalid TezosBigMap selector')

	return {
		selector: tezosBigMapContractBigMapIdSelector,
	}
}
