// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SorobanWasmSchema from '$/schema/SorobanWasm.ts'
import StellarNetworkSchema from '$/schema/StellarNetwork.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Stellar']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Stellar' && matchStringSegment(params.wasmHash)))
		error(404, 'Route mapping not applicable')

	const stellarNetworkNetworkParentSelector = parseRouteEntitySelector(
		schema,
		StellarNetworkSchema,
		parentData.selector,
		'Network'
	)
	if (stellarNetworkNetworkParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const sorobanWasmNetworkWasmHashSelector = parseRouteEntitySelector(
		schema,
		SorobanWasmSchema,
		{
			$network: stellarNetworkNetworkParentSelector,
			wasmHash: params.wasmHash,
		},
		'NetworkWasmHash'
	)
	if (sorobanWasmNetworkWasmHashSelector instanceof arktype.errors)
		error(404, 'Invalid SorobanWasm selector')

	return {
		selector: sorobanWasmNetworkWasmHashSelector,
	}
}
