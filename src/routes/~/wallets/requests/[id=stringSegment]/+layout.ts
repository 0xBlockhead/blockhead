// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadWalletRequestSchema from '$/schema/BlockheadWalletRequest.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.id)))
		error(404, 'Route mapping not applicable')

	const blockheadWalletRequestIdSelector = parseRouteEntitySelector(
		schema,
		BlockheadWalletRequestSchema,
		{
			id: params.id,
		},
		'Id'
	)
	if (blockheadWalletRequestIdSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadWalletRequest selector')

	return {
		selector: blockheadWalletRequestIdSelector,
	}
}
