// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EnsName_TimestampSchema from '$/schema/EnsName_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const ensNameTimestampSelector = parseEntitySelector(
		schema,
		EnsName_TimestampSchema,
		{
			$name: {
				name: decodeURIComponent(params.ensName),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (ensNameTimestampSelector instanceof arktype.errors) error(404, 'Invalid EnsName_Timestamp selector')

	return {
		selector: ensNameTimestampSelector,
	}
}
