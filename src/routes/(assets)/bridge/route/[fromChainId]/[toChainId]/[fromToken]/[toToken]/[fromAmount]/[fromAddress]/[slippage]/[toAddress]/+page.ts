import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BridgeRoute.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			fromChainId: decodeURIComponent(params.fromChainId),
			toChainId: decodeURIComponent(params.toChainId),
			fromToken: decodeURIComponent(params.fromToken),
			toToken: decodeURIComponent(params.toToken),
			fromAmount: decodeURIComponent(params.fromAmount),
			fromAddress: decodeURIComponent(params.fromAddress),
			slippage: decodeURIComponent(params.slippage),
			toAddress: decodeURIComponent(params.toAddress),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BridgeRoute selector')

	return { selector }
}
