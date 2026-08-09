// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import TezosBigMapSchema from '$/schema/TezosBigMap.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Tezos']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Tezos' && matchNonNegativeBigInt(params.bigMapId)))
		error(404, 'Route mapping not applicable')

	const tezosBigMapContractBigMapIdSelector = parseEntitySelector(
		schema,
		TezosBigMapSchema,
		{
			$contract: parentData.selector,
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
