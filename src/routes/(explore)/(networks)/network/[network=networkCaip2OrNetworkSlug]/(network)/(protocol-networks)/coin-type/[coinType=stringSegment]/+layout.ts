// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SuiCoinTypeSchema from '$/schema/SuiCoinType.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Sui']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Sui' && matchStringSegment(params.coinType)))
		error(404, 'Route mapping not applicable')

	const suiCoinTypeNetworkCoinTypeSelector = parseEntitySelector(
		schema,
		SuiCoinTypeSchema,
		{
			$network: parentData.selector,
			coinType: params.coinType,
		},
		'NetworkCoinType'
	)
	if (suiCoinTypeNetworkCoinTypeSelector instanceof arktype.errors)
		error(404, 'Invalid SuiCoinType selector')

	return {
		selector: suiCoinTypeNetworkCoinTypeSelector,
	}
}
