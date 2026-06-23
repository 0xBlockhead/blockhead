import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/GitRefUpdate.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$repository': {
				canonicalRemoteUrl: decodeURIComponent(params.canonicalRemoteUrl),
			},
			refName: decodeURIComponent(params.refName),
			oldObjectId: decodeURIComponent(params.oldObjectId),
			newObjectId: decodeURIComponent(params.newObjectId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid GitRefUpdate selector')

	return { selector }
}
