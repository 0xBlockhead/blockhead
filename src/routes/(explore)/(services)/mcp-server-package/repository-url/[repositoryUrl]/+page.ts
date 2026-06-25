import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/McpServerPackage.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			repositoryUrl: decodeURIComponent(params.repositoryUrl),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid McpServerPackage selector')

	return { selector }
}
