import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/AcpMessagePart.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$message': {
				'$session': {
					sessionId: decodeURIComponent(params.sessionId),
				},
				messageId: decodeURIComponent(params.messageId),
			},
			partIndex: Number(params.partIndex),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid AcpMessagePart selector')

	return { selector }
}
