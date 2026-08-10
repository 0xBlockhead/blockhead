// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CompoundPositionSchema from '$/schema/CompoundPosition.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchEvmAddress(params.accountAddress)))
		error(404, 'Route mapping not applicable')

	const compoundPositionAccountCometSelector = parseEntitySelector(
		schema,
		CompoundPositionSchema,
		{
			$account: {
				$network: parentData.selector.$network,
				$actor: {
					address: params.accountAddress,
				},
			},
			$comet: parentData.selector,
		},
		'AccountComet'
	)
	if (compoundPositionAccountCometSelector instanceof arktype.errors)
		error(404, 'Invalid CompoundPosition selector')

	return {
		selector: compoundPositionAccountCometSelector,
	}
}
