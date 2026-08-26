// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import UniswapV3PositionSchema from '$/schema/UniswapV3Position.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchEvmAddress(params.positionManager) && matchNonNegativeBigInt(params.tokenId)))
		error(404, 'Route mapping not applicable')

	const uniswapV3PositionPositionManagerTokenIdSelector = parseRouteEntitySelector(
		schema,
		UniswapV3PositionSchema,
		{
			positionManager: params.positionManager,
			tokenId: BigInt(params.tokenId),
		},
		'PositionManagerTokenId'
	)
	if (uniswapV3PositionPositionManagerTokenIdSelector instanceof arktype.errors)
		error(404, 'Invalid UniswapV3Position selector')

	return {
		selector: uniswapV3PositionPositionManagerTokenIdSelector,
	}
}
