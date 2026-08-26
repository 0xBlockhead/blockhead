// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import ZeroGNetworkSchema from '$/schema/ZeroGNetwork.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.slug)))
		error(404, 'Route mapping not applicable')

	const zeroGNetworkSlugSelector = parseRouteEntitySelector(
		schema,
		ZeroGNetworkSchema,
		{
			slug: params.slug,
		},
		'Slug'
	)
	if (zeroGNetworkSlugSelector instanceof arktype.errors)
		error(404, 'Invalid ZeroGNetwork selector')

	return {
		selector: zeroGNetworkSlugSelector,
	}
}
