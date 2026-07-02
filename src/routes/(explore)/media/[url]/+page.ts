// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import MediaSchema from '$/schema/Media.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const mediaSelector = parseEntitySelector(
		schema,
		MediaSchema,
		{
			url: decodeURIComponent(params.url),
		}
	)
	if (mediaSelector instanceof arktype.errors) error(404, 'Invalid Media selector')

	return {
		selector: mediaSelector,
	}
}
