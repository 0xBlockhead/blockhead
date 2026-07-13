// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { ZcashShieldedAction as ZcashShieldedActionSchema } from '$/schema/ZcashShieldedAction.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Zcash']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

	if (!((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'ZcashShielded')) && matchStringSegment(params.pool) && matchStringSegment(params.actionKind) && matchNonNegativeInteger(params.actionIndex))) error(404, 'Route mapping not applicable')

	const zcashShieldedActionTransactionPoolActionKindIndexInTransactionSelector = parseEntitySelector(
		schema,
		ZcashShieldedActionSchema,
		{
			$transaction: parentData.selector,
			pool: params.pool,
			actionKind: params.actionKind,
			indexInTransaction: Number(params.actionIndex),
		}
	)
	if (zcashShieldedActionTransactionPoolActionKindIndexInTransactionSelector instanceof arktype.errors) error(404, 'Invalid ZcashShieldedAction selector')

	return {
		selector: zcashShieldedActionTransactionPoolActionKindIndexInTransactionSelector,
	}
}
