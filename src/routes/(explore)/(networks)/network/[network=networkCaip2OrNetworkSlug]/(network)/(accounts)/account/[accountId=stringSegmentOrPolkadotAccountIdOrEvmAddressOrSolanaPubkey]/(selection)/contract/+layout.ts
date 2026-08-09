// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import TonContractSchema from '$/schema/TonContract.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const tonContractAccountSelector = parseEntitySelector(
		schema,
		TonContractSchema,
		{
			$account: parentData.selector,
		},
		'Account'
	)
	if (tonContractAccountSelector instanceof arktype.errors)
		error(404, 'Invalid TonContract selector')

	return {
		selector: tonContractAccountSelector,
	}
}
