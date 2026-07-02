// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmError_TimestampSchema from '$/schema/EvmError_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const evmErrorTimestampSelector = parseEntitySelector(
		schema,
		EvmError_TimestampSchema,
		{
			$error: {
				hex: decodeURIComponent(params.hex),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (evmErrorTimestampSelector instanceof arktype.errors) error(404, 'Invalid EvmError_Timestamp selector')

	return {
		selector: evmErrorTimestampSelector,
	}
}
