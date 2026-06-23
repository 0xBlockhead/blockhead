import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/RadicleIdentityDocument.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			rid: decodeURIComponent(params.rid),
			revision: decodeURIComponent(params.revision),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid RadicleIdentityDocument selector')

	return { selector }
}
