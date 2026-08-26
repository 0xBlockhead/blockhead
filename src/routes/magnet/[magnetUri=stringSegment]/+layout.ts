// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import MagnetLinkSchema from '$/schema/MagnetLink.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.magnetUri)))
		error(404, 'Route mapping not applicable')

	const magnetLinkMagnetUriSelector = parseRouteEntitySelector(
		schema,
		MagnetLinkSchema,
		{
			magnetUri: params.magnetUri,
		},
		'MagnetUri'
	)
	if (magnetLinkMagnetUriSelector instanceof arktype.errors)
		error(404, 'Invalid MagnetLink selector')

	return {
		selector: magnetLinkMagnetUriSelector,
	}
}
