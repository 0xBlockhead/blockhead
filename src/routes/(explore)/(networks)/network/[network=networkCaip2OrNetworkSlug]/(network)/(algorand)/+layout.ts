// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import AlgorandNetworkSchema from '$/schema/AlgorandNetwork.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Algorand']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Algorand'))
		error(404, 'Route mapping not applicable')

	const algorandNetworkNetworkSelector = parseEntitySelector(
		schema,
		AlgorandNetworkSchema,
		{
			$network: parentData.selector,
		},
		'Network'
	)
	if (algorandNetworkNetworkSelector instanceof arktype.errors)
		error(404, 'Invalid AlgorandNetwork selector')

	return {
		selector: algorandNetworkNetworkSelector,
	}
}
