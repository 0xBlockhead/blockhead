// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import AlgorandBoxSchema from '$/schema/AlgorandBox.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Algorand']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Algorand' && matchZeroExHex(params.boxName)))
		error(404, 'Route mapping not applicable')

	const algorandBoxApplicationBoxNameSelector = parseEntitySelector(
		schema,
		AlgorandBoxSchema,
		{
			$application: parentData.selector,
			boxName: params.boxName,
		},
		'ApplicationBoxName'
	)
	if (algorandBoxApplicationBoxNameSelector instanceof arktype.errors)
		error(404, 'Invalid AlgorandBox selector')

	return {
		selector: algorandBoxApplicationBoxNameSelector,
	}
}
