// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AiModelProviderSchema from '$/schema/AiModelProvider.ts'
import AiProviderApiOperationSchema from '$/schema/AiProviderApiOperation.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.operationId)))
		error(404, 'Route mapping not applicable')

	const aiModelProviderProviderIdParentSelector = parseRouteEntitySelector(
		schema,
		AiModelProviderSchema,
		parentData.selector,
		'ProviderId'
	)
	if (aiModelProviderProviderIdParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const aiProviderApiOperationProviderOperationIdSelector = parseRouteEntitySelector(
		schema,
		AiProviderApiOperationSchema,
		{
			$provider: aiModelProviderProviderIdParentSelector,
			operationId: params.operationId,
		},
		'ProviderOperationId'
	)
	if (aiProviderApiOperationProviderOperationIdSelector instanceof arktype.errors)
		error(404, 'Invalid AiProviderApiOperation selector')

	return {
		selector: aiProviderApiOperationProviderOperationIdSelector,
	}
}
