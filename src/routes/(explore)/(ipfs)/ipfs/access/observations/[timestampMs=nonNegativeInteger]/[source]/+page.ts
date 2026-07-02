// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import _GlobalIpfsAccess_TimestampSchema from '$/schema/_GlobalIpfsAccess_Timestamp.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const globalIpfsAccessTimestampSelector = parseEntitySelector(
		schema,
		_GlobalIpfsAccess_TimestampSchema,
		{
			$hub: {
				scope: '_GlobalIpfsAccess',
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (globalIpfsAccessTimestampSelector instanceof arktype.errors) error(404, 'Invalid _GlobalIpfsAccess_Timestamp selector')

	return {
		selector: globalIpfsAccessTimestampSelector,
	}
}
