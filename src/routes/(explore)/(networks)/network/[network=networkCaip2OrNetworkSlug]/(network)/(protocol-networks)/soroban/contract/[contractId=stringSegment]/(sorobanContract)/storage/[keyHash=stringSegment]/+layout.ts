// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SorobanContractStorageEntrySchema from '$/schema/SorobanContractStorageEntry.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Stellar']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Stellar' && matchStringSegment(params.keyHash)))
		error(404, 'Route mapping not applicable')

	const sorobanContractStorageEntryContractKeyHashSelector = parseEntitySelector(
		schema,
		SorobanContractStorageEntrySchema,
		{
			$contract: parentData.selector,
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
