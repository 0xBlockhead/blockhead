import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/GitForgeMirror.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			forgeHost: decodeURIComponent(params.forgeHost),
			owner: decodeURIComponent(params.owner),
			repositoryName: decodeURIComponent(params.repositoryName),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid GitForgeMirror selector')

	return { selector }
}
