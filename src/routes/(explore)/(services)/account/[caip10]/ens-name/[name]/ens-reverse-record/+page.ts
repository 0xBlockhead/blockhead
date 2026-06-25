import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/EnsReverseRecord.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$account': {
				caip10: decodeURIComponent(params.caip10),
			},
			'$name': {
				name: decodeURIComponent(params.name),
			},
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid EnsReverseRecord selector')

	return { selector }
}
