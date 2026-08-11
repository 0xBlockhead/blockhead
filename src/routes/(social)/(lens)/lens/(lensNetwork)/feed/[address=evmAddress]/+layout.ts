// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import LensFeedSchema from '$/schema/LensFeed.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchEvmAddress(params.address)))
		error(404, 'Route mapping not applicable')

	const lensFeedAddressSelector = parseEntitySelector(
		schema,
		LensFeedSchema,
		{
			address: params.address,
		},
		'Address'
	)
	if (lensFeedAddressSelector instanceof arktype.errors)
		error(404, 'Invalid LensFeed selector')

	return {
		selector: lensFeedAddressSelector,
	}
}
