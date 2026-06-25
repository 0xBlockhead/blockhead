import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/GitForgeIssue.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$forgeMirror': {
				forgeHost: decodeURIComponent(params.forgeHost),
				owner: decodeURIComponent(params.owner),
				repositoryName: decodeURIComponent(params.repositoryName),
			},
			issueNumber: decodeURIComponent(params.issueNumber),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid GitForgeIssue selector')

	return { selector }
}
