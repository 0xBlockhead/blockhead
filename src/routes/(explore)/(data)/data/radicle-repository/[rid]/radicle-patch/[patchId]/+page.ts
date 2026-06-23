import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/RadiclePatch.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$repository': {
				rid: decodeURIComponent(params.rid),
			},
			patchId: decodeURIComponent(params.patchId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid RadiclePatch selector')

	return { selector }
}
