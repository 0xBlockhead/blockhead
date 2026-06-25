import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/AcpToolCall.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$promptTurn': {
				'$session': {
					sessionId: decodeURIComponent(params.sessionId),
				},
				turnId: decodeURIComponent(params.turnId),
			},
			toolCallId: decodeURIComponent(params.toolCallId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid AcpToolCall selector')

	return { selector }
}
