// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import ZcashShieldedActionSchema from '$/schema/ZcashShieldedAction.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const zcashShieldedActionSelector = parseEntitySelector(
		schema,
		ZcashShieldedActionSchema,
		{
			$transaction: {
				$network: {
					slug: params.networkSlug,
				},
				txId: decodeURIComponent(params.txId),
			},
			pool: decodeURIComponent(params.pool),
			actionKind: decodeURIComponent(params.actionKind),
			indexInTransaction: Number(params.actionIndex),
		}
	)
	if (zcashShieldedActionSelector instanceof arktype.errors) error(404, 'Invalid ZcashShieldedAction selector')

	return {
		selector: zcashShieldedActionSelector,
	}
}
