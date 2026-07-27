// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmLogSchema from '$/schema/EvmLog.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

	if (!((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')) && matchNonNegativeInteger(params.indexInTransaction))) error(404, 'Route mapping not applicable')

	const evmLogTransactionIndexInTransactionSelector = parseEntitySelector(
		schema,
		EvmLogSchema,
		{
			$transaction: parentData.selector,
			indexInTransaction: Number(params.indexInTransaction),
		}
	)
	if (evmLogTransactionIndexInTransactionSelector instanceof arktype.errors) error(404, 'Invalid EvmLog selector')

	return {
		selector: evmLogTransactionIndexInTransactionSelector,
	}
}
