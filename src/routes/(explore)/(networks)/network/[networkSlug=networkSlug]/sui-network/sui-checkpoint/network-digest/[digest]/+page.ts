import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/SuiCheckpoint.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$network': {
				'$network': {
					slug: decodeURIComponent(params.networkSlug),
				},
			},
			digest: decodeURIComponent(params.digest),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid SuiCheckpoint selector')

	return { selector }
}
