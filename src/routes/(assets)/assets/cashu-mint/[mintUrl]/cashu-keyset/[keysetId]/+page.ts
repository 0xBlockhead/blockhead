import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/CashuKeyset.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$mint': {
				mintUrl: decodeURIComponent(params.mintUrl),
			},
			keysetId: decodeURIComponent(params.keysetId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid CashuKeyset selector')

	return { selector }
}
