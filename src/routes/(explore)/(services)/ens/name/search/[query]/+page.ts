import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BlockheadEnsNameSearch.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			query: decodeURIComponent(params.query),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BlockheadEnsNameSearch selector')

	return { selector }
}
