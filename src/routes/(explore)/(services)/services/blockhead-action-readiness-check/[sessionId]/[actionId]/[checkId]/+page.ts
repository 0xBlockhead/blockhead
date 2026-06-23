import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BlockheadActionReadinessCheck.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			sessionId: decodeURIComponent(params.sessionId),
			actionId: decodeURIComponent(params.actionId),
			checkId: decodeURIComponent(params.checkId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BlockheadActionReadinessCheck selector')

	return { selector }
}
