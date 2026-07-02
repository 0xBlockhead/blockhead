// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EnsRecord_TimestampSchema from '$/schema/EnsRecord_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const ensRecordTimestampSelector = parseEntitySelector(
		schema,
		EnsRecord_TimestampSchema,
		{
			$record: {
				$name: {
					name: decodeURIComponent(params.ensName),
				},
				recordKey: decodeURIComponent(params.recordId),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (ensRecordTimestampSelector instanceof arktype.errors) error(404, 'Invalid EnsRecord_Timestamp selector')

	return {
		selector: ensRecordTimestampSelector,
	}
}
