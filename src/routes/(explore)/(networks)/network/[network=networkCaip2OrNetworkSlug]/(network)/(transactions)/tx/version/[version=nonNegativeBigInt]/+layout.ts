// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AptosTransactionSchema from '$/schema/AptosTransaction.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Aptos']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Aptos' && matchNonNegativeBigInt(params.version)))
		error(404, 'Route mapping not applicable')

	const aptosTransactionNetworkVersionSelector = parseRouteEntitySelector(
		schema,
		AptosTransactionSchema,
		{
			$network: {
				$network: parentData.selector,
			},
			version: BigInt(params.version),
		},
		'NetworkVersion'
	)
	if (aptosTransactionNetworkVersionSelector instanceof arktype.errors)
		error(404, 'Invalid AptosTransaction selector')

	return {
		selector: aptosTransactionNetworkVersionSelector,
	}
}
