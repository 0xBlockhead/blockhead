// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { MevRelay as MevRelaySchema } from '$/schema/MevRelay.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

	if (!((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')) && matchStringSegment(params.host))) error(404, 'Route mapping not applicable')

	const mevRelayEvmNetworkHostSelector = parseEntitySelector(
		schema,
		MevRelaySchema,
		{
			$network: parentData.selector,
			host: params.host,
		}
	)
	if (mevRelayEvmNetworkHostSelector instanceof arktype.errors) error(404, 'Invalid MevRelay selector')

	return {
		selector: mevRelayEvmNetworkHostSelector,
	}
}
