// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { EvmCalldata as EvmCalldataSchema } from '$/schema/EvmCalldata.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const evmCalldataHexSelector = parseEntitySelector(
		schema,
		EvmCalldataSchema,
		{
			hex: '0x00000000',
		}
	)
	if (evmCalldataHexSelector instanceof arktype.errors) error(404, 'Invalid EvmCalldata selector')

	return {
		selector: evmCalldataHexSelector,
	}
}
