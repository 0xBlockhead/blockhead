// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmLogSchema from '$/schema/EvmLog.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			parentData.projectionNetwork.executionModels !== undefined
			&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
		)
		&& matchNonNegativeInteger(params.indexInTransaction)
	))
		error(404, 'Route mapping not applicable')

	const evmLogTransactionIndexInTransactionSelector = parseEntitySelector(
		schema,
		EvmLogSchema,
		{
			$transaction: parentData.selector,
			indexInTransaction: Number(params.indexInTransaction),
		},
		'TransactionIndexInTransaction'
	)
	if (evmLogTransactionIndexInTransactionSelector instanceof arktype.errors)
		error(404, 'Invalid EvmLog selector')

	return {
		selector: evmLogTransactionIndexInTransactionSelector,
	}
}
