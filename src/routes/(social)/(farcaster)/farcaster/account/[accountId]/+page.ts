// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadFarcasterAccountConnectionSchema from '$/schema/BlockheadFarcasterAccountConnection.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const blockheadFarcasterAccountConnectionSelector = parseEntitySelector(
		schema,
		BlockheadFarcasterAccountConnectionSchema,
		{
			fid: Number(params.accountId),
		}
	)
	if (blockheadFarcasterAccountConnectionSelector instanceof arktype.errors) error(404, 'Invalid BlockheadFarcasterAccountConnection selector')

	return {
		selector: blockheadFarcasterAccountConnectionSelector,
	}
}
