// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import GitRepositorySchema from '$/schema/GitRepository.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.repositoryId)))
		error(404, 'Route mapping not applicable')

	const gitRepositoryRepositoryIdSelector = parseRouteEntitySelector(
		schema,
		GitRepositorySchema,
		{
			repositoryId: params.repositoryId,
		},
		'RepositoryId'
	)
	if (gitRepositoryRepositoryIdSelector instanceof arktype.errors)
		error(404, 'Invalid GitRepository selector')

	return {
		selector: gitRepositoryRepositoryIdSelector,
	}
}
