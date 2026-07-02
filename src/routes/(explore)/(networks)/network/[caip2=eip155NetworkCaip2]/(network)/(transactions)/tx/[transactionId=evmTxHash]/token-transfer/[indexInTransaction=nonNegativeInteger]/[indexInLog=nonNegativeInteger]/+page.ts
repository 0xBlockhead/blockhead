// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmTokenTransferSchema from '$/schema/EvmTokenTransfer.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const evmTokenTransferSelector = parseEntitySelector(
		schema,
		EvmTokenTransferSchema,
		{
			$log: {
				$transaction: {
					$network: {
						caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
					},
					txHash: decodeURIComponent(params.transactionId),
				},
				indexInTransaction: Number(params.indexInTransaction),
			},
			indexInLog: Number(params.indexInLog),
		}
	)
	if (evmTokenTransferSelector instanceof arktype.errors) error(404, 'Invalid EvmTokenTransfer selector')

	return {
		selector: evmTokenTransferSelector,
	}
}
