import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BlockheadActionOutcome_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$outcome': {
				sessionId: decodeURIComponent(params.sessionId),
				actionId: decodeURIComponent(params.actionId),
				outcomeId: decodeURIComponent(params.outcomeId),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BlockheadActionOutcome_Timestamp selector')

	return { selector }
}
