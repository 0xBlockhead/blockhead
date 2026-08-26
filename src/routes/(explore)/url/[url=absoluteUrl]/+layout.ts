// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchAbsoluteUrl } from '$/params/absoluteUrl.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import UrlSchema from '$/schema/Url.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchAbsoluteUrl(params.url)))
		error(404, 'Route mapping not applicable')

	const urlUrlSelector = parseRouteEntitySelector(
		schema,
		UrlSchema,
		{
			url: decodeURIComponent(params.url),
		},
		'Url'
	)
	if (urlUrlSelector instanceof arktype.errors)
		error(404, 'Invalid Url selector')

	return {
		selector: urlUrlSelector,
	}
}
