// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SorobanContractSchema from '$/schema/SorobanContract.ts'
import SorobanContractStorageEntrySchema from '$/schema/SorobanContractStorageEntry.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Stellar']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Stellar' && matchStringSegment(params.keyHash)))
		error(404, 'Route mapping not applicable')

	const sorobanContractNetworkContractIdParentSelector = parseRouteEntitySelector(
		schema,
		SorobanContractSchema,
		parentData.selector,
		'NetworkContractId'
	)
	if (sorobanContractNetworkContractIdParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const sorobanContractStorageEntryContractKeyHashSelector = parseRouteEntitySelector(
		schema,
		SorobanContractStorageEntrySchema,
		{
			$contract: sorobanContractNetworkContractIdParentSelector,
			keyHash: params.keyHash,
		},
		'ContractKeyHash'
	)
	if (sorobanContractStorageEntryContractKeyHashSelector instanceof arktype.errors)
		error(404, 'Invalid SorobanContractStorageEntry selector')

	return {
		selector: sorobanContractStorageEntryContractKeyHashSelector,
	}
}
