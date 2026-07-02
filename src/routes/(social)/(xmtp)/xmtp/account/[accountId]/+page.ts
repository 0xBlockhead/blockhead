// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmAccountSchema from '$/schema/EvmAccount.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const evmAccountSelector = parseEntitySelector(
		schema,
		EvmAccountSchema,
		{
			address: decodeURIComponent(params.accountId),
		}
	)
	if (evmAccountSelector instanceof arktype.errors) error(404, 'Invalid EvmAccount selector')

	return {
		selector: evmAccountSelector,
	}
}
