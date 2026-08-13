// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadSourceEndpointSchema from '$/schema/BlockheadSourceEndpoint.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.bindingId) && matchNonNegativeInteger(params.endpointIndex)))
		error(404, 'Route mapping not applicable')

	const blockheadSourceEndpointSourceBindingIdEndpointIndexSelector = parseEntitySelector(
		schema,
		BlockheadSourceEndpointSchema,
		{
			$source: parentData.selector,
			bindingId: decodeURIComponent(params.bindingId),
			endpointIndex: Number(params.endpointIndex),
		},
		'SourceBindingIdEndpointIndex'
	)
	if (blockheadSourceEndpointSourceBindingIdEndpointIndexSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadSourceEndpoint selector')

	return {
		selector: blockheadSourceEndpointSourceBindingIdEndpointIndexSelector,
	}
}
