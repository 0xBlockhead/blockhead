// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SuiNetworkSchema from '$/schema/SuiNetwork.ts'
import SuiPackageSchema from '$/schema/SuiPackage.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Sui']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Sui' && matchStringSegment(params.originalPackageId)))
		error(404, 'Route mapping not applicable')

	const suiNetworkNetworkParentSelector = parseRouteEntitySelector(
		schema,
		SuiNetworkSchema,
		parentData.selector,
		'Network'
	)
	if (suiNetworkNetworkParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const suiPackageNetworkOriginalPackageIdSelector = parseRouteEntitySelector(
		schema,
		SuiPackageSchema,
		{
			$network: suiNetworkNetworkParentSelector,
			originalPackageId: params.originalPackageId,
		},
		'NetworkOriginalPackageId'
	)
	if (suiPackageNetworkOriginalPackageIdSelector instanceof arktype.errors)
		error(404, 'Invalid SuiPackage selector')

	return {
		selector: suiPackageNetworkOriginalPackageIdSelector,
	}
}
