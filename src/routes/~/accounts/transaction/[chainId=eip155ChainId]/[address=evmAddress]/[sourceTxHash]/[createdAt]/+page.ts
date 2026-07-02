// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadBridgeTransactionSchema from '$/schema/BlockheadBridgeTransaction.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const blockheadBridgeTransactionSelector = parseEntitySelector(
		schema,
		BlockheadBridgeTransactionSchema,
		{
			$account: {
				interopAddress: 'eip155:' + String(params.chainId) + ':' + String(params.address),
			},
			$sourceTx: {
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: params.chainId,
					},
				},
				txHash: decodeURIComponent(params.sourceTxHash),
			},
			createdAt: Number(params.createdAt),
		}
	)
	if (blockheadBridgeTransactionSelector instanceof arktype.errors) error(404, 'Invalid BlockheadBridgeTransaction selector')

	return {
		selector: blockheadBridgeTransactionSelector,
	}
}
