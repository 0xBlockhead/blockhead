// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import HyperliquidValidatorSchema from '$/schema/HyperliquidValidator.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Hyperliquid']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Hyperliquid' && matchStringSegment(params.validator)))
		error(404, 'Route mapping not applicable')

	const hyperliquidValidatorNetworkValidatorSelector = parseEntitySelector(
		schema,
		HyperliquidValidatorSchema,
		{
			$network: parentData.selector.$network,
			validator: params.validator,
		},
		'NetworkValidator'
	)
	if (hyperliquidValidatorNetworkValidatorSelector instanceof arktype.errors)
		error(404, 'Invalid HyperliquidValidator selector')

	return {
		selector: hyperliquidValidatorNetworkValidatorSelector,
	}
}
