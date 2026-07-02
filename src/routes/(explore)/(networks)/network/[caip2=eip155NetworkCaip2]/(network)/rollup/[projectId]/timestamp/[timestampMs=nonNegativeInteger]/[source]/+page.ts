// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmRollup_TimestampSchema from '$/schema/EvmRollup_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const evmRollupTimestampSelector = parseEntitySelector(
		schema,
		EvmRollup_TimestampSchema,
		{
			$rollup: {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				projectId: decodeURIComponent(params.projectId),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (evmRollupTimestampSelector instanceof arktype.errors) error(404, 'Invalid EvmRollup_Timestamp selector')

	return {
		selector: evmRollupTimestampSelector,
	}
}
