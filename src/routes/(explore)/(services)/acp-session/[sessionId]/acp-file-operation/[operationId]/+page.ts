import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/AcpFileOperation.ts'
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
			operationId: decodeURIComponent(params.operationId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid AcpFileOperation selector')

	return { selector }
}
