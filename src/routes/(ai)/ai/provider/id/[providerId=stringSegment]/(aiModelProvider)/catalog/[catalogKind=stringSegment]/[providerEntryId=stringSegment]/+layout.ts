// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AiProviderCatalogEntrySchema from '$/schema/AiProviderCatalogEntry.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.catalogKind) && matchStringSegment(params.providerEntryId)))
		error(404, 'Route mapping not applicable')

	const aiProviderCatalogEntryProviderCatalogKindProviderEntryIdSelector = parseRouteEntitySelector(
		schema,
		AiProviderCatalogEntrySchema,
		{
			$provider: parentData.selector,
			catalogKind: params.catalogKind,
			providerEntryId: params.providerEntryId,
		},
		'ProviderCatalogKindProviderEntryId'
	)
	if (aiProviderCatalogEntryProviderCatalogKindProviderEntryIdSelector instanceof arktype.errors)
		error(404, 'Invalid AiProviderCatalogEntry selector')

	return {
		selector: aiProviderCatalogEntryProviderCatalogKindProviderEntryIdSelector,
	}
}
