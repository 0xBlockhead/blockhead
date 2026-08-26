// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import EnsNameSchema from '$/schema/EnsName.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.ensName)))
		error(404, 'Route mapping not applicable')

	const ensNameNormalizedNameSelector = parseRouteEntitySelector(
		schema,
		EnsNameSchema,
		{
			name: decodeURIComponent(params.ensName),
		},
		'NormalizedName'
	)
	if (ensNameNormalizedNameSelector instanceof arktype.errors)
		error(404, 'Invalid EnsName selector')

	return {
		selector: ensNameNormalizedNameSelector,
	}
}
