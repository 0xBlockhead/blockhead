import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/GitRef.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$repository': {
				repositoryId: decodeURIComponent(params.repositoryId),
			},
			refName: decodeURIComponent(params.refName),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid GitRef selector')

	return { selector }
}
