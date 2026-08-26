// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import GitForgeMirrorSchema from '$/schema/GitForgeMirror.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.forgeHost) && matchStringSegment(params.owner) && matchStringSegment(params.repositoryName)))
		error(404, 'Route mapping not applicable')

	const gitForgeMirrorForgeHostOwnerRepositoryNameSelector = parseRouteEntitySelector(
		schema,
		GitForgeMirrorSchema,
		{
			forgeHost: params.forgeHost,
			owner: params.owner,
			repositoryName: params.repositoryName,
		},
		'ForgeHostOwnerRepositoryName'
	)
	if (gitForgeMirrorForgeHostOwnerRepositoryNameSelector instanceof arktype.errors)
		error(404, 'Invalid GitForgeMirror selector')

	return {
		selector: gitForgeMirrorForgeHostOwnerRepositoryNameSelector,
	}
}
