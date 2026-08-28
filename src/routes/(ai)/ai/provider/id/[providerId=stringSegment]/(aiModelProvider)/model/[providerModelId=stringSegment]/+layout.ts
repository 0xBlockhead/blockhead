// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AiModelSchema from '$/schema/AiModel.ts'
import AiModelProviderSchema from '$/schema/AiModelProvider.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.providerModelId)))
		error(404, 'Route mapping not applicable')

	const aiModelProviderProviderIdParentSelector = parseRouteEntitySelector(
		schema,
		AiModelProviderSchema,
		parentData.selector,
		'ProviderId'
	)
	if (aiModelProviderProviderIdParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const aiModelProviderModelIdSelector = parseRouteEntitySelector(
		schema,
		AiModelSchema,
		{
			$provider: aiModelProviderProviderIdParentSelector,
			providerModelId: params.providerModelId,
		},
		'ProviderModelId'
	)
	if (aiModelProviderModelIdSelector instanceof arktype.errors)
		error(404, 'Invalid AiModel selector')

	return {
		selector: aiModelProviderModelIdSelector,
	}
}
