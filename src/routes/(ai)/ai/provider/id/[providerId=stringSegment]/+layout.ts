// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AiModelProviderSchema from '$/schema/AiModelProvider.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.providerId)))
		error(404, 'Route mapping not applicable')

	const aiModelProviderProviderIdSelector = parseRouteEntitySelector(
		schema,
		AiModelProviderSchema,
		{
			providerId: params.providerId,
		},
		'ProviderId'
	)
	if (aiModelProviderProviderIdSelector instanceof arktype.errors)
		error(404, 'Invalid AiModelProvider selector')

	return {
		selector: aiModelProviderProviderIdSelector,
	}
}
