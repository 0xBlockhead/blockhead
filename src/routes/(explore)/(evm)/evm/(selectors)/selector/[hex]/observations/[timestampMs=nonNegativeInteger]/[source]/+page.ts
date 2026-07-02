// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmSelector_TimestampSchema from '$/schema/EvmSelector_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const evmSelectorTimestampSelector = parseEntitySelector(
		schema,
		EvmSelector_TimestampSchema,
		{
			$selector: {
				hex: decodeURIComponent(params.hex),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (evmSelectorTimestampSelector instanceof arktype.errors) error(404, 'Invalid EvmSelector_Timestamp selector')

	return {
		selector: evmSelectorTimestampSelector,
	}
}
