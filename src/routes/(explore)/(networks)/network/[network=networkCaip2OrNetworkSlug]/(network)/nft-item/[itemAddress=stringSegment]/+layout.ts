// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import TonNftItemSchema from '$/schema/TonNftItem.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.itemAddress)))
		error(404, 'Route mapping not applicable')

	const tonNftItemNetworkItemAddressSelector = parseEntitySelector(
		schema,
		TonNftItemSchema,
		{
			$network: parentData.selector,
			itemAddress: params.itemAddress,
		},
		'NetworkItemAddress'
	)
	if (tonNftItemNetworkItemAddressSelector instanceof arktype.errors)
		error(404, 'Invalid TonNftItem selector')

	return {
		selector: tonNftItemNetworkItemAddressSelector,
	}
}
