// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmTxHash } from '$/params/evmTxHash.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import MorphoMarketSchema from '$/schema/MorphoMarket.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			(
				parentData.projectionNetwork.executionModels !== undefined
				&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
			)
			&& parentData.projectionNetwork.namespace === 'Evm'
		)
		&& matchEvmTxHash(params.marketId)
	))
		error(404, 'Route mapping not applicable')

	const morphoMarketNetworkMarketIdSelector = parseEntitySelector(
		schema,
		MorphoMarketSchema,
		{
			$network: parentData.selector,
			marketId: params.marketId,
		},
		'NetworkMarketId'
	)
	if (morphoMarketNetworkMarketIdSelector instanceof arktype.errors)
		error(404, 'Invalid MorphoMarket selector')

	return {
		selector: morphoMarketNetworkMarketIdSelector,
	}
}
