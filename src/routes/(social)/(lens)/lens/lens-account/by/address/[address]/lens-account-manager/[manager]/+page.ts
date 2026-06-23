import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/LensAccountManager.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$account': {
				address: decodeURIComponent(params.address),
			},
			manager: decodeURIComponent(params.manager),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid LensAccountManager selector')

	return { selector }
}
