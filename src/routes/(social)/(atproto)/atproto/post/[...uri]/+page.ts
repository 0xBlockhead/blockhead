// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import AtprotoPostSchema from '$/schema/AtprotoPost.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const atprotoPostSelector = parseEntitySelector(
		schema,
		AtprotoPostSchema,
		{
			uri: decodeURIComponent(params.uri),
		}
	)
	if (atprotoPostSelector instanceof arktype.errors) error(404, 'Invalid AtprotoPost selector')

	return {
		selector: atprotoPostSelector,
	}
}
