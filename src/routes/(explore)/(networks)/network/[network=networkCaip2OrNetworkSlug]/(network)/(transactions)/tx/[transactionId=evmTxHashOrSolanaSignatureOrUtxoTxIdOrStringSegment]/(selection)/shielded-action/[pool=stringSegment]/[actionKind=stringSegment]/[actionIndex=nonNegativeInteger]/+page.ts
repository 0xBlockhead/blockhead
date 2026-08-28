// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import UtxoTransactionSchema from '$/schema/UtxoTransaction.ts'
import ZcashShieldedActionSchema from '$/schema/ZcashShieldedAction.ts'
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
		&& matchStringSegment(params.actionKind)
		&& matchNonNegativeInteger(params.actionIndex)
	))
		error(404, 'Route mapping not applicable')

	const utxoTransactionNetworkTxIdParentSelector = parseRouteEntitySelector(
		schema,
		UtxoTransactionSchema,
		parentData.selector,
		'NetworkTxId'
	)
	if (utxoTransactionNetworkTxIdParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const zcashShieldedActionTransactionPoolActionKindIndexInTransactionSelector = parseRouteEntitySelector(
		schema,
		ZcashShieldedActionSchema,
		{
			$transaction: utxoTransactionNetworkTxIdParentSelector,
			pool: params.pool,
			actionKind: params.actionKind,
			indexInTransaction: Number(params.actionIndex),
		},
		'TransactionPoolActionKindIndexInTransaction'
	)
	if (zcashShieldedActionTransactionPoolActionKindIndexInTransactionSelector instanceof arktype.errors)
		error(404, 'Invalid ZcashShieldedAction selector')

	return {
		selector: zcashShieldedActionTransactionPoolActionKindIndexInTransactionSelector,
	}
}
