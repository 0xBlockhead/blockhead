// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmTopic_TimestampSchema from '$/schema/EvmTopic_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const evmTopicTimestampSelector = parseEntitySelector(
		schema,
		EvmTopic_TimestampSchema,
		{
			$topic: {
				hex: decodeURIComponent(params.hex),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (evmTopicTimestampSelector instanceof arktype.errors) error(404, 'Invalid EvmTopic_Timestamp selector')

	return {
		selector: evmTopicTimestampSelector,
	}
}
