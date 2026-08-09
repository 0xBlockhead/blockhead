// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import GitRefSchema from '$/schema/GitRef.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.refName)))
		error(404, 'Route mapping not applicable')

	const gitRefRepositoryRefNameSelector = parseEntitySelector(
		schema,
		GitRefSchema,
		{
			$repository: parentData.selector,
			refName: params.refName,
		},
		'RepositoryRefName'
	)
	if (gitRefRepositoryRefNameSelector instanceof arktype.errors)
		error(404, 'Invalid GitRef selector')

	return {
		selector: gitRefRepositoryRefNameSelector,
	}
}
