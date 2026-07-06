// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import ZcashShieldedPoolSchema from '$/schema/ZcashShieldedPool.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const zcashShieldedPoolSelector = parseEntitySelector(
		schema,
		ZcashShieldedPoolSchema,
		{
			$network: {
				slug: params.networkSlug,
			},
			pool: decodeURIComponent(params.pool),
		}
	)
	if (zcashShieldedPoolSelector instanceof arktype.errors) error(404, 'Invalid ZcashShieldedPool selector')

	return {
		selector: zcashShieldedPoolSelector,
	}
}
