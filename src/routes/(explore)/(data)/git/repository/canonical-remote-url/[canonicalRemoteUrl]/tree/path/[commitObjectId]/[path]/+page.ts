import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/GitTreePathResolution.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$repository': {
				canonicalRemoteUrl: decodeURIComponent(params.canonicalRemoteUrl),
			},
			commitObjectId: decodeURIComponent(params.commitObjectId),
			path: decodeURIComponent(params.path),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid GitTreePathResolution selector')

	return { selector }
}
