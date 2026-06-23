import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/SpecificationProposal.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			realm: decodeURIComponent(params.realm),
			category: decodeURIComponent(params.category),
			number: decodeURIComponent(params.number),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid SpecificationProposal selector')

	return { selector }
}
