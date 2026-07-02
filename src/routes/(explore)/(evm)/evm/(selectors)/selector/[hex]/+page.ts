// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmSelectorSchema from '$/schema/EvmSelector.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const evmSelectorSelector = parseEntitySelector(
		schema,
		EvmSelectorSchema,
		{
			hex: decodeURIComponent(params.hex),
		}
	)
	if (evmSelectorSelector instanceof arktype.errors) error(404, 'Invalid EvmSelector selector')

	return {
		selector: evmSelectorSelector,
	}
}
