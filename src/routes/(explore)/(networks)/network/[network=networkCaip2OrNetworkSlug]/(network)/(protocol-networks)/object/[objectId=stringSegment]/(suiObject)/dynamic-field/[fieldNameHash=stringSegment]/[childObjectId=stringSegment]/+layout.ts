// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SuiDynamicFieldEdgeSchema from '$/schema/SuiDynamicFieldEdge.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Sui']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		parentData.projectionNetwork.namespace === 'Sui'
		&& matchStringSegment(params.fieldNameHash)
		&& matchStringSegment(params.childObjectId)
	))
		error(404, 'Route mapping not applicable')

	const suiDynamicFieldEdgeParentObjectFieldNameHashChildObjectIdSelector = parseEntitySelector(
		schema,
		SuiDynamicFieldEdgeSchema,
		{
			$parentObject: parentData.selector,
			fieldNameHash: params.fieldNameHash,
			childObjectId: params.childObjectId,
		},
		'ParentObjectFieldNameHashChildObjectId'
	)
	if (suiDynamicFieldEdgeParentObjectFieldNameHashChildObjectIdSelector instanceof arktype.errors)
		error(404, 'Invalid SuiDynamicFieldEdge selector')

	return {
		selector: suiDynamicFieldEdgeParentObjectFieldNameHashChildObjectIdSelector,
	}
}
