// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadSessionSchema from '$/schema/BlockheadSession.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const blockheadSessionSelector = parseEntitySelector(
		schema,
		BlockheadSessionSchema,
		{
			id: params.sessionId,
		}
	)
	if (blockheadSessionSelector instanceof arktype.errors) error(404, 'Invalid BlockheadSession selector')

	return {
		selector: blockheadSessionSelector,
	}
}
