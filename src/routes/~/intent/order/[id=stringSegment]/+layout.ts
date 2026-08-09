// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadIntentOrderSchema from '$/schema/BlockheadIntentOrder.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.id)))
		error(404, 'Route mapping not applicable')

	const blockheadIntentOrderIdSelector = parseEntitySelector(
		schema,
		BlockheadIntentOrderSchema,
		{
			id: params.id,
		},
		'Id'
	)
	if (blockheadIntentOrderIdSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadIntentOrder selector')

	return {
		selector: blockheadIntentOrderIdSelector,
	}
}
