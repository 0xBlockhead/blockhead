// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import TezosBigMapKeySchema from '$/schema/TezosBigMapKey.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Tezos']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Tezos' && matchStringSegment(params.keyHash)))
		error(404, 'Route mapping not applicable')

	const tezosBigMapKeyBigMapKeyHashSelector = parseRouteEntitySelector(
		schema,
		TezosBigMapKeySchema,
		{
			$bigMap: parentData.selector,
			keyHash: params.keyHash,
		},
		'BigMapKeyHash'
	)
	if (tezosBigMapKeyBigMapKeyHashSelector instanceof arktype.errors)
		error(404, 'Invalid TezosBigMapKey selector')

	return {
		selector: tezosBigMapKeyBigMapKeyHashSelector,
	}
}
