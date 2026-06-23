import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/AcpMessage.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$session': {
				sessionId: decodeURIComponent(params.sessionId),
			},
			messageId: decodeURIComponent(params.messageId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid AcpMessage selector')

	return { selector }
}
