// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import GitForgeCompareSchema from '$/schema/GitForgeCompare.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchZeroExHex(params.fromObjectId) && matchZeroExHex(params.toObjectId)))
		error(404, 'Route mapping not applicable')

	const gitForgeCompareForgeMirrorFromObjectIdToObjectIdSelector = parseEntitySelector(
		schema,
		GitForgeCompareSchema,
		{
			$forgeMirror: parentData.selector,
			fromObjectId: params.fromObjectId,
			toObjectId: params.toObjectId,
		},
		'ForgeMirrorFromObjectIdToObjectId'
	)
	if (gitForgeCompareForgeMirrorFromObjectIdToObjectIdSelector instanceof arktype.errors)
		error(404, 'Invalid GitForgeCompare selector')

	return {
		selector: gitForgeCompareForgeMirrorFromObjectIdToObjectIdSelector,
	}
}
