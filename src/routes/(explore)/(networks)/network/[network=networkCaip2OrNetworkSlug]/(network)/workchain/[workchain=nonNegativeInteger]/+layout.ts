// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import TonWorkchainSchema from '$/schema/TonWorkchain.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchNonNegativeInteger(params.workchain)))
		error(404, 'Route mapping not applicable')

	const tonWorkchainNetworkWorkchainSelector = parseEntitySelector(
		schema,
		TonWorkchainSchema,
		{
			$network: parentData.selector,
			workchain: Number(params.workchain),
		},
		'NetworkWorkchain'
	)
	if (tonWorkchainNetworkWorkchainSelector instanceof arktype.errors)
		error(404, 'Invalid TonWorkchain selector')

	return {
		selector: tonWorkchainNetworkWorkchainSelector,
	}
}
