import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/CctpMessage.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			sourceDomain: decodeURIComponent(params.sourceDomain),
			nonce: decodeURIComponent(params.nonce),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid CctpMessage selector')

	return { selector }
}
