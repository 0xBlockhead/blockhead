// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchAbsoluteUrl } from '$/params/absoluteUrl.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import AiDocumentSchema from '$/schema/AiDocument.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchAbsoluteUrl(params.documentUrl)))
		error(404, 'Route mapping not applicable')

	const aiDocumentDocumentUrlSelector = parseEntitySelector(
		schema,
		AiDocumentSchema,
		{
			documentUrl: decodeURIComponent(params.documentUrl),
		},
		'DocumentUrl'
	)
	if (aiDocumentDocumentUrlSelector instanceof arktype.errors)
		error(404, 'Invalid AiDocument selector')

	return {
		selector: aiDocumentDocumentUrlSelector,
	}
}
