import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/MoveFunction.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$module': {
				'$network': {
					slug: decodeURIComponent(params.networkSlug),
				},
				address: decodeURIComponent(params.address),
				moduleName: decodeURIComponent(params.moduleName),
			},
			functionName: decodeURIComponent(params.functionName),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid MoveFunction selector')

	return { selector }
}
