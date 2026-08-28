// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AiArtifactSchema from '$/schema/AiArtifact.ts'
import AiModelProviderSchema from '$/schema/AiModelProvider.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.providerArtifactId)))
		error(404, 'Route mapping not applicable')

	const aiModelProviderProviderIdParentSelector = parseRouteEntitySelector(
		schema,
		AiModelProviderSchema,
		parentData.selector,
		'ProviderId'
	)
	if (aiModelProviderProviderIdParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const aiArtifactProviderArtifactIdSelector = parseRouteEntitySelector(
		schema,
		AiArtifactSchema,
		{
			$provider: aiModelProviderProviderIdParentSelector,
			providerArtifactId: params.providerArtifactId,
		},
		'ProviderArtifactId'
	)
	if (aiArtifactProviderArtifactIdSelector instanceof arktype.errors)
		error(404, 'Invalid AiArtifact selector')

	return {
		selector: aiArtifactProviderArtifactIdSelector,
	}
}
