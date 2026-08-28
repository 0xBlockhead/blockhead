// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import GitForgeMirrorSchema from '$/schema/GitForgeMirror.ts'
import GitForgeReleaseSchema from '$/schema/GitForgeRelease.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.releaseTagName)))
		error(404, 'Route mapping not applicable')

	const gitForgeMirrorForgeHostOwnerRepositoryNameParentSelector = parseRouteEntitySelector(
		schema,
		GitForgeMirrorSchema,
		parentData.selector,
		'ForgeHostOwnerRepositoryName'
	)
	if (gitForgeMirrorForgeHostOwnerRepositoryNameParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const gitForgeReleaseForgeMirrorReleaseTagNameSelector = parseRouteEntitySelector(
		schema,
		GitForgeReleaseSchema,
		{
			$forgeMirror: gitForgeMirrorForgeHostOwnerRepositoryNameParentSelector,
			releaseTagName: params.releaseTagName,
		},
		'ForgeMirrorReleaseTagName'
	)
	if (gitForgeReleaseForgeMirrorReleaseTagNameSelector instanceof arktype.errors)
		error(404, 'Invalid GitForgeRelease selector')

	return {
		selector: gitForgeReleaseForgeMirrorReleaseTagNameSelector,
	}
}
