// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import AtprotoPostSchema from '$/schema/AtprotoPost.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.uri)))
		error(404, 'Route mapping not applicable')

	const atprotoPostUriSelector = parseEntitySelector(
		schema,
		AtprotoPostSchema,
		{
			uri: decodeURIComponent(params.uri),
		},
		'Uri'
	)
	if (atprotoPostUriSelector instanceof arktype.errors)
		error(404, 'Invalid AtprotoPost selector')

	return {
		selector: atprotoPostUriSelector,
	}
}
