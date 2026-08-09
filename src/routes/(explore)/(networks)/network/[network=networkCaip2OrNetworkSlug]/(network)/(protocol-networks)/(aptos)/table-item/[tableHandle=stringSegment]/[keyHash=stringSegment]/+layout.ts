// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
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

	const aptosTableItemNetworkTableHandleKeyHashSelector = parseEntitySelector(
		schema,
		AptosTableItemSchema,
		{
			$network: parentData.selector,
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
