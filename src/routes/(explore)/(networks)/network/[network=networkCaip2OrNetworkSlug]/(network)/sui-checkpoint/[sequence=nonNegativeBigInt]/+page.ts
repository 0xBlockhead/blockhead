// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SuiCheckpointSchema from '$/schema/SuiCheckpoint.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Sui']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Sui' && matchNonNegativeBigInt(params.sequence)))
		error(404, 'Route mapping not applicable')

	const suiCheckpointNetworkSequenceSelector = parseEntitySelector(
		schema,
		SuiCheckpointSchema,
		{
			$network: {
				$network: parentData.selector,
			},
			sequence: BigInt(params.sequence),
		},
		'NetworkSequence'
	)
	if (suiCheckpointNetworkSequenceSelector instanceof arktype.errors)
		error(404, 'Invalid SuiCheckpoint selector')

	return {
		selector: suiCheckpointNetworkSequenceSelector,
	}
}
