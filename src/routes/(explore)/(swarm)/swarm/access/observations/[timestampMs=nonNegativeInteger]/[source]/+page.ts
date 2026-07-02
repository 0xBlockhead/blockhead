// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import _GlobalSwarmAccess_TimestampSchema from '$/schema/_GlobalSwarmAccess_Timestamp.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const globalSwarmAccessTimestampSelector = parseEntitySelector(
		schema,
		_GlobalSwarmAccess_TimestampSchema,
		{
			$hub: {
				scope: '_GlobalSwarmAccess',
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (globalSwarmAccessTimestampSelector instanceof arktype.errors) error(404, 'Invalid _GlobalSwarmAccess_Timestamp selector')

	return {
		selector: globalSwarmAccessTimestampSelector,
	}
}
