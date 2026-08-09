// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import _GlobalAiArtifactCatalogSchema from '$/schema/_GlobalAiArtifactCatalog.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.catalogId)))
		error(404, 'Route mapping not applicable')

	const globalAiArtifactCatalogCatalogIdSelector = parseEntitySelector(
		schema,
		_GlobalAiArtifactCatalogSchema,
		{
			catalogId: params.catalogId,
		},
		'CatalogId'
	)
	if (globalAiArtifactCatalogCatalogIdSelector instanceof arktype.errors)
		error(404, 'Invalid _GlobalAiArtifactCatalog selector')

	return {
		selector: globalAiArtifactCatalogCatalogIdSelector,
	}
}
