import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/ArweaveResource.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			transactionId: decodeURIComponent(params.transactionId),
			contentPath: decodeURIComponent(params.contentPath),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid ArweaveResource selector')

	return { selector }
}
