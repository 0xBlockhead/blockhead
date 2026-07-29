// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { match as matchAbsoluteUrl } from '$/params/absoluteUrl.ts'
import { match as matchNetworkCaip2 } from '$/params/networkCaip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmNetworkBridgeSchema from '$/schema/EvmNetworkBridge.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			parentData.projectionNetwork.executionModels !== undefined
			&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
		)
		&& matchNetworkCaip2(params.toCaip2)
		&& matchAbsoluteUrl(params.url)
	))
		error(404, 'Route mapping not applicable')

	const evmNetworkBridgeFromToUrlSelector = parseEntitySelector(
		schema,
		EvmNetworkBridgeSchema,
		{
			$fromNetwork: parentData.selector,
			$toNetwork: {
				caip2: caip2SelectorValueFromString(params.toCaip2),
			},
			url: decodeURIComponent(params.url),
		}
	)
	if (evmNetworkBridgeFromToUrlSelector instanceof arktype.errors)
		error(404, 'Invalid EvmNetworkBridge selector')

	return {
		selector: evmNetworkBridgeFromToUrlSelector,
	}
}
