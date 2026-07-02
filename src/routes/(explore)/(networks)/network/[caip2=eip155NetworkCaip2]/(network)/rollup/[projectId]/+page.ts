// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmRollupSchema from '$/schema/EvmRollup.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const evmRollupSelector = parseEntitySelector(
		schema,
		EvmRollupSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			projectId: decodeURIComponent(params.projectId),
		}
	)
	if (evmRollupSelector instanceof arktype.errors) error(404, 'Invalid EvmRollup selector')

	return {
		selector: evmRollupSelector,
	}
}
