// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmBlobSchema from '$/schema/EvmBlob.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const evmBlobSelector = parseEntitySelector(
		schema,
		EvmBlobSchema,
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
	if (evmBlobSelector instanceof arktype.errors) error(404, 'Invalid EvmBlob selector')

	return {
		selector: evmBlobSelector,
	}
}
