// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import GitForgeMirrorSchema from '$/schema/GitForgeMirror.ts'
import GitForgePipelineSchema from '$/schema/GitForgePipeline.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchNonNegativeInteger(params.pipelineId)))
		error(404, 'Route mapping not applicable')

	const gitForgeMirrorForgeHostOwnerRepositoryNameParentSelector = parseRouteEntitySelector(
		schema,
		GitForgeMirrorSchema,
		parentData.selector,
		'ForgeHostOwnerRepositoryName'
	)
	if (gitForgeMirrorForgeHostOwnerRepositoryNameParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const gitForgePipelineForgeMirrorPipelineIdSelector = parseRouteEntitySelector(
		schema,
		GitForgePipelineSchema,
		{
			$forgeMirror: gitForgeMirrorForgeHostOwnerRepositoryNameParentSelector,
			pipelineId: Number(params.pipelineId),
		},
		'ForgeMirrorPipelineId'
	)
	if (gitForgePipelineForgeMirrorPipelineIdSelector instanceof arktype.errors)
		error(404, 'Invalid GitForgePipeline selector')

	return {
		selector: gitForgePipelineForgeMirrorPipelineIdSelector,
	}
}
