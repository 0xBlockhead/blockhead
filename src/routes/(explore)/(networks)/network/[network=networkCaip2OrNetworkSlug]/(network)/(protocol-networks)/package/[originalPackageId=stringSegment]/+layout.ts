// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SuiPackageSchema from '$/schema/SuiPackage.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Sui']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Sui' && matchStringSegment(params.originalPackageId)))
		error(404, 'Route mapping not applicable')

	const suiPackageNetworkOriginalPackageIdSelector = parseEntitySelector(
		schema,
		SuiPackageSchema,
		{
			$network: parentData.selector,
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
