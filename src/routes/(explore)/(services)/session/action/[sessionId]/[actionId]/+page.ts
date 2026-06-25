import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BlockheadSessionAction.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			sessionId: decodeURIComponent(params.sessionId),
			actionId: decodeURIComponent(params.actionId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BlockheadSessionAction selector')

	return { selector }
}
