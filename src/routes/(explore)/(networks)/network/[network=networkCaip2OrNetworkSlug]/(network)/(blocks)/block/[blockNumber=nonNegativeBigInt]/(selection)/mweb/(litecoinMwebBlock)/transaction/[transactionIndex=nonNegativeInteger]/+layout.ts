// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import LitecoinMwebBlockSchema from '$/schema/LitecoinMwebBlock.ts'
import LitecoinMwebTransactionSchema from '$/schema/LitecoinMwebTransaction.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchNonNegativeInteger(params.transactionIndex)))
		error(404, 'Route mapping not applicable')

	const litecoinMwebBlockUtxoBlockParentSelector = parseRouteEntitySelector(
		schema,
		LitecoinMwebBlockSchema,
		parentData.selector,
		'UtxoBlock'
	)
	if (litecoinMwebBlockUtxoBlockParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const litecoinMwebTransactionLitecoinMwebBlockTransactionIndexSelector = parseRouteEntitySelector(
		schema,
		LitecoinMwebTransactionSchema,
		{
			$mwebBlock: litecoinMwebBlockUtxoBlockParentSelector,
			transactionIndex: Number(params.transactionIndex),
		},
		'LitecoinMwebBlockTransactionIndex'
	)
	if (litecoinMwebTransactionLitecoinMwebBlockTransactionIndexSelector instanceof arktype.errors)
		error(404, 'Invalid LitecoinMwebTransaction selector')

	return {
		selector: litecoinMwebTransactionLitecoinMwebBlockTransactionIndexSelector,
	}
}
