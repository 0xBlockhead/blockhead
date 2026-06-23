import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/AcpSession.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			sessionId: decodeURIComponent(params.sessionId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid AcpSession selector')

	return { selector }
}
