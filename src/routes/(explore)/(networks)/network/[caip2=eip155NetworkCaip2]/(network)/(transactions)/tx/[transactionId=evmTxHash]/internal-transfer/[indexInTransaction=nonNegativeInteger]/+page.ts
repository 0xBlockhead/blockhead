// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmInternalTransferSchema from '$/schema/EvmInternalTransfer.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const evmInternalTransferSelector = parseEntitySelector(
		schema,
		EvmInternalTransferSchema,
		{
			$transaction: {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				txHash: decodeURIComponent(params.transactionId),
			},
			indexInTransaction: Number(params.indexInTransaction),
		}
	)
	if (evmInternalTransferSelector instanceof arktype.errors) error(404, 'Invalid EvmInternalTransfer selector')

	return {
		selector: evmInternalTransferSelector,
	}
}
