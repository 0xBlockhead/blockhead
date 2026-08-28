// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import GitRefSchema from '$/schema/GitRef.ts'
import GitRepositorySchema from '$/schema/GitRepository.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.refName)))
		error(404, 'Route mapping not applicable')

	const gitRepositoryRepositoryIdParentSelector = parseRouteEntitySelector(
		schema,
		GitRepositorySchema,
		parentData.selector,
		'RepositoryId'
	)
	if (gitRepositoryRepositoryIdParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const gitRefRepositoryRefNameSelector = parseRouteEntitySelector(
		schema,
		GitRefSchema,
		{
			$repository: gitRepositoryRepositoryIdParentSelector,
			refName: params.refName,
		},
		'RepositoryRefName'
	)
	if (gitRefRepositoryRefNameSelector instanceof arktype.errors)
		error(404, 'Invalid GitRef selector')

	return {
		selector: gitRefRepositoryRefNameSelector,
	}
}
