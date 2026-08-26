// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchAbsoluteUrl } from '$/params/absoluteUrl.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import GitRepositorySchema from '$/schema/GitRepository.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchAbsoluteUrl(params.canonicalRemoteUrl)))
		error(404, 'Route mapping not applicable')

	const gitRepositoryCanonicalRemoteUrlSelector = parseRouteEntitySelector(
		schema,
		GitRepositorySchema,
		{
			canonicalRemoteUrl: decodeURIComponent(params.canonicalRemoteUrl),
		},
		'CanonicalRemoteUrl'
	)
	if (gitRepositoryCanonicalRemoteUrlSelector instanceof arktype.errors)
		error(404, 'Invalid GitRepository selector')

	return {
		selector: gitRepositoryCanonicalRemoteUrlSelector,
	}
}
