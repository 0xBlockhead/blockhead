import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/SwarmResource.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			reference: decodeURIComponent(params.reference),
			contentPath: decodeURIComponent(params.contentPath),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid SwarmResource selector')

	return { selector }
}
