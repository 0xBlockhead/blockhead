// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import StellarTransactionSchema from '$/schema/StellarTransaction.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Stellar']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Stellar' && matchStringSegment(params.hash)))
		error(404, 'Route mapping not applicable')

	const stellarTransactionNetworkHashSelector = parseRouteEntitySelector(
		schema,
		StellarTransactionSchema,
		{
			$network: parentData.selector,
			hash: params.hash,
		},
		'NetworkHash'
	)
	if (stellarTransactionNetworkHashSelector instanceof arktype.errors)
		error(404, 'Invalid StellarTransaction selector')

	return {
		selector: stellarTransactionNetworkHashSelector,
	}
}
