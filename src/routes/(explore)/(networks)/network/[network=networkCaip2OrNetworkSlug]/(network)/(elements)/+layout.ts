// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import ElementsNetworkSchema from '$/schema/ElementsNetwork.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Elements']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Elements'))
		error(404, 'Route mapping not applicable')

	const elementsNetworkNetworkSelector = parseRouteEntitySelector(
		schema,
		ElementsNetworkSchema,
		{
			$network: parentData.selector,
		},
		'Network'
	)
	if (elementsNetworkNetworkSelector instanceof arktype.errors)
		error(404, 'Invalid ElementsNetwork selector')

	return {
		selector: elementsNetworkNetworkSelector,
	}
}
