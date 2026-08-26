// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import RadicleIdentityDocumentSchema from '$/schema/RadicleIdentityDocument.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.rid) && matchStringSegment(params.revision)))
		error(404, 'Route mapping not applicable')

	const radicleIdentityDocumentRidRevisionSelector = parseRouteEntitySelector(
		schema,
		RadicleIdentityDocumentSchema,
		{
			rid: params.rid,
			revision: params.revision,
		},
		'RidRevision'
	)
	if (radicleIdentityDocumentRidRevisionSelector instanceof arktype.errors)
		error(404, 'Invalid RadicleIdentityDocument selector')

	return {
		selector: radicleIdentityDocumentRidRevisionSelector,
	}
}
