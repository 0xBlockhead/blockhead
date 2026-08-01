// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import ZcashShieldedPoolSchema from '$/schema/ZcashShieldedPool.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Zcash']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			parentData.projectionNetwork.executionModels !== undefined
			&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'ZcashShielded')
		)
		&& matchStringSegment(params.pool)
	))
		error(404, 'Route mapping not applicable')

	const zcashShieldedPoolNetworkPoolSelector = parseEntitySelector(
		schema,
		ZcashShieldedPoolSchema,
		{
			$network: parentData.selector,
			pool: params.pool,
		},
		'NetworkPool'
	)
	if (zcashShieldedPoolNetworkPoolSelector instanceof arktype.errors)
		error(404, 'Invalid ZcashShieldedPool selector')

	return {
		selector: zcashShieldedPoolNetworkPoolSelector,
	}
}
