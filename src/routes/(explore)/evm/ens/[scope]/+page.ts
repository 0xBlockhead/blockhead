import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/_GlobalEnsNetwork.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			scope: decodeURIComponent(params.scope),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid _GlobalEnsNetwork selector')

	return { selector }
}
