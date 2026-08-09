// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CardanoBlockSchema from '$/schema/CardanoBlock.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Cardano']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Cardano' && matchNonNegativeBigInt(params.slot)))
		error(404, 'Route mapping not applicable')

	const cardanoBlockNetworkSlotSelector = parseEntitySelector(
		schema,
		CardanoBlockSchema,
		{
			$network: parentData.selector,
			slot: BigInt(params.slot),
		},
		'NetworkSlot'
	)
	if (cardanoBlockNetworkSlotSelector instanceof arktype.errors)
		error(404, 'Invalid CardanoBlock selector')

	return {
		selector: cardanoBlockNetworkSlotSelector,
	}
}
