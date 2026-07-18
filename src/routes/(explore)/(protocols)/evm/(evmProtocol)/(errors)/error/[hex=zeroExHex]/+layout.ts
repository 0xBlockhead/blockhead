// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { EvmError as EvmErrorSchema } from '$/schema/EvmError.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchZeroExHex(params.hex))) error(404, 'Route mapping not applicable')

	const evmErrorHexSelector = parseEntitySelector(
		schema,
		EvmErrorSchema,
		{
			hex: params.hex,
		}
	)
	if (evmErrorHexSelector instanceof arktype.errors) error(404, 'Invalid EvmError selector')

	return {
		selector: evmErrorHexSelector,
	}
}
