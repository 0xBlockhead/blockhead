// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import UrlSchema from '$/schema/Url.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const urlSelector = parseEntitySelector(
		schema,
		UrlSchema,
		{
			url: decodeURIComponent(params.url),
		}
	)
	if (urlSelector instanceof arktype.errors) error(404, 'Invalid Url selector')

	return {
		selector: urlSelector,
	}
}
