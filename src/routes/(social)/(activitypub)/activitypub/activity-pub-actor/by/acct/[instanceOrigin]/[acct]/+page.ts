import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/ActivityPubActor.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			instanceOrigin: decodeURIComponent(params.instanceOrigin),
			acct: decodeURIComponent(params.acct),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid ActivityPubActor selector')

	return { selector }
}
