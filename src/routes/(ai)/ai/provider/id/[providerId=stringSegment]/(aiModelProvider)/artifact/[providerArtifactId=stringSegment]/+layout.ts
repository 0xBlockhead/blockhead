// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import AiArtifactSchema from '$/schema/AiArtifact.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.providerArtifactId)))
		error(404, 'Route mapping not applicable')

	const aiArtifactProviderArtifactIdSelector = parseEntitySelector(
		schema,
		AiArtifactSchema,
		{
			$provider: parentData.selector,
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
