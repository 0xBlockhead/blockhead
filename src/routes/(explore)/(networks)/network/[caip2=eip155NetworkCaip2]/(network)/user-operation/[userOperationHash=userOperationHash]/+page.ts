// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmUserOperationSchema from '$/schema/EvmUserOperation.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const evmUserOperationSelector = parseEntitySelector(
		schema,
		EvmUserOperationSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			hash: decodeURIComponent(params.userOperationHash),
		}
	)
	if (evmUserOperationSelector instanceof arktype.errors) error(404, 'Invalid EvmUserOperation selector')

	return {
		selector: evmUserOperationSelector,
	}
}
