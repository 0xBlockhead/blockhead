// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmSelectorSchema from '$/schema/EvmSelector.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchZeroExHex(params.hex)))
		error(404, 'Route mapping not applicable')

	const evmSelectorHexSelector = parseEntitySelector(
		schema,
		EvmSelectorSchema,
		{
			hex: params.hex,
		},
		'Hex'
	)
	if (evmSelectorHexSelector instanceof arktype.errors)
		error(404, 'Invalid EvmSelector selector')

	return {
		selector: evmSelectorHexSelector,
	}
}
