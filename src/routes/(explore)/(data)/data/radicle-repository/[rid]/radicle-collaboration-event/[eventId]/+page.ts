import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/RadicleCollaborationEvent.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$repository': {
				rid: decodeURIComponent(params.rid),
			},
			eventId: decodeURIComponent(params.eventId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid RadicleCollaborationEvent selector')

	return { selector }
}
