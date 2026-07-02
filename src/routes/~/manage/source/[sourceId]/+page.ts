// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadSourceSchema from '$/schema/BlockheadSource.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const blockheadSourceSelector = parseEntitySelector(
		schema,
		BlockheadSourceSchema,
		{
			id: params.sourceId,
		}
	)
	if (blockheadSourceSelector instanceof arktype.errors) error(404, 'Invalid BlockheadSource selector')

	return {
		selector: blockheadSourceSelector,
	}
}
