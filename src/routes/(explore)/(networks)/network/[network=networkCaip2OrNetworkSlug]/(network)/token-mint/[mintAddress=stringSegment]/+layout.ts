// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SolanaTokenMintSchema from '$/schema/SolanaTokenMint.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Solana']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			parentData.projectionNetwork.executionModels !== undefined
			&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'SolanaRuntime')
		)
		&& matchStringSegment(params.mintAddress)
	))
		error(404, 'Route mapping not applicable')

	const solanaTokenMintNetworkMintAddressSelector = parseRouteEntitySelector(
		schema,
		SolanaTokenMintSchema,
		{
			$network: parentData.selector,
			mintAddress: params.mintAddress,
		},
		'NetworkMintAddress'
	)
	if (solanaTokenMintNetworkMintAddressSelector instanceof arktype.errors)
		error(404, 'Invalid SolanaTokenMint selector')

	return {
		selector: solanaTokenMintNetworkMintAddressSelector,
	}
}
