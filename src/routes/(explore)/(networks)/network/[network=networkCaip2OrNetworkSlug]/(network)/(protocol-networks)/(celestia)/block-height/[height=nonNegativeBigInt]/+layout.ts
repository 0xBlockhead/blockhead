// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import CelestiaBlockSchema from '$/schema/CelestiaBlock.ts'
import CelestiaNetworkSchema from '$/schema/CelestiaNetwork.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Celestia']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Celestia' && matchNonNegativeBigInt(params.height)))
		error(404, 'Route mapping not applicable')

	const celestiaNetworkNetworkParentSelector = parseRouteEntitySelector(
		schema,
		CelestiaNetworkSchema,
		parentData.selector,
		'Network'
	)
	if (celestiaNetworkNetworkParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const celestiaBlockNetworkHeightSelector = parseRouteEntitySelector(
		schema,
		CelestiaBlockSchema,
		{
			$network: celestiaNetworkNetworkParentSelector,
			height: BigInt(params.height),
		},
		'NetworkHeight'
	)
	if (celestiaBlockNetworkHeightSelector instanceof arktype.errors)
		error(404, 'Invalid CelestiaBlock selector')

	return {
		selector: celestiaBlockNetworkHeightSelector,
	}
}
