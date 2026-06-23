import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/AiDocument.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$artifact': {
				ipfsCid: decodeURIComponent(params.ipfsCid),
			},
			documentKind: decodeURIComponent(params.documentKind),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid AiDocument selector')

	return { selector }
}
