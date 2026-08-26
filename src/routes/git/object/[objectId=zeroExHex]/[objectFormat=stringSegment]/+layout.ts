// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import GitObjectSchema from '$/schema/GitObject.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchZeroExHex(params.objectId) && matchStringSegment(params.objectFormat)))
		error(404, 'Route mapping not applicable')

	const gitObjectObjectIdObjectFormatSelector = parseRouteEntitySelector(
		schema,
		GitObjectSchema,
		{
			objectId: params.objectId,
			objectFormat: params.objectFormat,
		},
		'ObjectIdObjectFormat'
	)
	if (gitObjectObjectIdObjectFormatSelector instanceof arktype.errors)
		error(404, 'Invalid GitObject selector')

	return {
		selector: gitObjectObjectIdObjectFormatSelector,
	}
}
