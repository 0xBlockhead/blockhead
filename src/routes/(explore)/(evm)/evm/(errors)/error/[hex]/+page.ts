// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmErrorSchema from '$/schema/EvmError.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const evmErrorSelector = parseEntitySelector(
		schema,
		EvmErrorSchema,
		{
			hex: decodeURIComponent(params.hex),
		}
	)
	if (evmErrorSelector instanceof arktype.errors) error(404, 'Invalid EvmError selector')

	return {
		selector: evmErrorSelector,
	}
}
