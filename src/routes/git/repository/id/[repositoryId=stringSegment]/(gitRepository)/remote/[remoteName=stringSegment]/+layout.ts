// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import GitRemoteSchema from '$/schema/GitRemote.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.remoteName)))
		error(404, 'Route mapping not applicable')

	const gitRemoteRepositoryRemoteNameSelector = parseRouteEntitySelector(
		schema,
		GitRemoteSchema,
		{
			$repository: parentData.selector,
			remoteName: params.remoteName,
		},
		'RepositoryRemoteName'
	)
	if (gitRemoteRepositoryRemoteNameSelector instanceof arktype.errors)
		error(404, 'Invalid GitRemote selector')

	return {
		selector: gitRemoteRepositoryRemoteNameSelector,
	}
}
