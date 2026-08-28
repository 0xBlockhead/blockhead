// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import RadicleRepositorySchema from '$/schema/RadicleRepository.ts'
import RadicleSignedRefSchema from '$/schema/RadicleSignedRef.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.nodeId) && matchStringSegment(params.refName)))
		error(404, 'Route mapping not applicable')

	const radicleRepositoryRidParentSelector = parseRouteEntitySelector(
		schema,
		RadicleRepositorySchema,
		parentData.selector,
		'Rid'
	)
	if (radicleRepositoryRidParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const radicleSignedRefRepositoryNodeIdRefNameSelector = parseRouteEntitySelector(
		schema,
		RadicleSignedRefSchema,
		{
			$repository: radicleRepositoryRidParentSelector,
			nodeId: params.nodeId,
			refName: params.refName,
		},
		'RepositoryNodeIdRefName'
	)
	if (radicleSignedRefRepositoryNodeIdRefNameSelector instanceof arktype.errors)
		error(404, 'Invalid RadicleSignedRef selector')

	return {
		selector: radicleSignedRefRepositoryNodeIdRefNameSelector,
	}
}
