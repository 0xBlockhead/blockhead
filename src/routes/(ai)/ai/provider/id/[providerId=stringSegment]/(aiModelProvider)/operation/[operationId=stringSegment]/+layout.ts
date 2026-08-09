// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import AiProviderApiOperationSchema from '$/schema/AiProviderApiOperation.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.operationId)))
		error(404, 'Route mapping not applicable')

	const aiProviderApiOperationProviderOperationIdSelector = parseEntitySelector(
		schema,
		AiProviderApiOperationSchema,
		{
			$provider: parentData.selector,
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
