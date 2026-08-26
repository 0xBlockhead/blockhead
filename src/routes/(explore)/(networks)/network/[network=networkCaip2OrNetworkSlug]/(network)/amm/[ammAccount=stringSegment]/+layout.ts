// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import XrplAmmSchema from '$/schema/XrplAmm.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Xrpl']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Xrpl' && matchStringSegment(params.ammAccount)))
		error(404, 'Route mapping not applicable')

	const xrplAmmNetworkAmmAccountSelector = parseRouteEntitySelector(
		schema,
		XrplAmmSchema,
		{
			$network: parentData.selector,
			ammAccount: params.ammAccount,
		},
		'NetworkAmmAccount'
	)
	if (xrplAmmNetworkAmmAccountSelector instanceof arktype.errors)
		error(404, 'Invalid XrplAmm selector')

	return {
		selector: xrplAmmNetworkAmmAccountSelector,
	}
}
