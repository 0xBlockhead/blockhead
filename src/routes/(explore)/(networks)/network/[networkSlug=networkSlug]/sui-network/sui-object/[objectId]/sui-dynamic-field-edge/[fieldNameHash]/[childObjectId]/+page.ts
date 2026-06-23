import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/SuiDynamicFieldEdge.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$parentObject': {
				'$network': {
					'$network': {
						slug: decodeURIComponent(params.networkSlug),
					},
				},
				objectId: decodeURIComponent(params.objectId),
			},
			fieldNameHash: decodeURIComponent(params.fieldNameHash),
			childObjectId: decodeURIComponent(params.childObjectId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid SuiDynamicFieldEdge selector')

	return { selector }
}
