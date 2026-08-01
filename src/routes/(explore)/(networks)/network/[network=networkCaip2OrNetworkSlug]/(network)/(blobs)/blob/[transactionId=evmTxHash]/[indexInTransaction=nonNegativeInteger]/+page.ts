// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmTxHash } from '$/params/evmTxHash.ts'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmBlobSchema from '$/schema/EvmBlob.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			parentData.projectionNetwork.executionModels !== undefined
			&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
		)
		&& matchEvmTxHash(params.transactionId)
		&& matchNonNegativeInteger(params.indexInTransaction)
	))
		error(404, 'Route mapping not applicable')

	const evmBlobTransactionIndexInTransactionSelector = parseEntitySelector(
		schema,
		EvmBlobSchema,
		{
			$transaction: {
				$network: parentData.selector,
				txHash: params.transactionId,
			},
			indexInTransaction: Number(params.indexInTransaction),
		},
		'TransactionIndexInTransaction'
	)
	if (evmBlobTransactionIndexInTransactionSelector instanceof arktype.errors)
		error(404, 'Invalid EvmBlob selector')

	return {
		selector: evmBlobTransactionIndexInTransactionSelector,
	}
}
