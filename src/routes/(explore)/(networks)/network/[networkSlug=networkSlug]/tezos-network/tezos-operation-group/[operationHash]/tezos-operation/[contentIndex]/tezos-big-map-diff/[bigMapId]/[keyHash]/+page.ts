import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/TezosBigMapDiff.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$operation': {
				'$operationGroup': {
					'$network': {
						'$network': {
							slug: decodeURIComponent(params.networkSlug),
						},
					},
					operationHash: decodeURIComponent(params.operationHash),
				},
				contentIndex: decodeURIComponent(params.contentIndex),
			},
			bigMapId: decodeURIComponent(params.bigMapId),
			keyHash: decodeURIComponent(params.keyHash),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid TezosBigMapDiff selector')

	return { selector }
}
