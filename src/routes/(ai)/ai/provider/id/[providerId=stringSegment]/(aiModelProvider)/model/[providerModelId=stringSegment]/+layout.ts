// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import AiModelSchema from '$/schema/AiModel.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.providerModelId)))
		error(404, 'Route mapping not applicable')

	const aiModelProviderModelIdSelector = parseEntitySelector(
		schema,
		AiModelSchema,
		{
			$provider: parentData.selector,
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
