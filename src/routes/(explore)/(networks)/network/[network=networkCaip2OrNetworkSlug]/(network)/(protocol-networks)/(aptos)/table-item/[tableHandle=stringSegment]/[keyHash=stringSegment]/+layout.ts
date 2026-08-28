// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AptosNetworkSchema from '$/schema/AptosNetwork.ts'
import AptosTableItemSchema from '$/schema/AptosTableItem.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Aptos']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		parentData.projectionNetwork.namespace === 'Aptos'
		&& matchStringSegment(params.tableHandle)
		&& matchStringSegment(params.keyHash)
	))
		error(404, 'Route mapping not applicable')

	const aptosNetworkNetworkParentSelector = parseRouteEntitySelector(
		schema,
		AptosNetworkSchema,
		parentData.selector,
		'Network'
	)
	if (aptosNetworkNetworkParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const aptosTableItemNetworkTableHandleKeyHashSelector = parseRouteEntitySelector(
		schema,
		AptosTableItemSchema,
		{
			$network: aptosNetworkNetworkParentSelector,
			tableHandle: params.tableHandle,
			keyHash: params.keyHash,
		},
		'NetworkTableHandleKeyHash'
	)
	if (aptosTableItemNetworkTableHandleKeyHashSelector instanceof arktype.errors)
		error(404, 'Invalid AptosTableItem selector')

	return {
		selector: aptosTableItemNetworkTableHandleKeyHashSelector,
	}
}
