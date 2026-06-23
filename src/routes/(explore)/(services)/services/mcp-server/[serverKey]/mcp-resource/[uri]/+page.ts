import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/McpResource.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$server': {
				serverKey: decodeURIComponent(params.serverKey),
			},
			uri: decodeURIComponent(params.uri),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid McpResource selector')

	return { selector }
}
