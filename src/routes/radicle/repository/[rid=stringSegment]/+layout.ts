// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import RadicleRepositorySchema from '$/schema/RadicleRepository.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.rid)))
		error(404, 'Route mapping not applicable')

	const radicleRepositoryRidSelector = parseRouteEntitySelector(
		schema,
		RadicleRepositorySchema,
		{
			rid: params.rid,
		},
		'Rid'
	)
	if (radicleRepositoryRidSelector instanceof arktype.errors)
		error(404, 'Invalid RadicleRepository selector')

	return {
		selector: radicleRepositoryRidSelector,
	}
}
