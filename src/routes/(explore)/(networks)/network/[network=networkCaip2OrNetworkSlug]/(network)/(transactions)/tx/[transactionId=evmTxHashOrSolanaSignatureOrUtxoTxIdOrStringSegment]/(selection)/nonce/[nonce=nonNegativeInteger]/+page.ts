// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import HederaTransactionSchema from '$/schema/HederaTransaction.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Hedera']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		parentData.projectionNetwork.namespace === 'Hedera'
		&& matchStringSegment(params.transactionId)
		&& matchNonNegativeInteger(params.nonce)
	))
		error(404, 'Route mapping not applicable')

	const hederaTransactionNetworkTransactionIdNonceSelector = parseRouteEntitySelector(
		schema,
		HederaTransactionSchema,
		{
			$network: parentData.selector,
			transactionId: params.transactionId,
			nonce: Number(params.nonce),
		},
		'NetworkTransactionIdNonce'
	)
	if (hederaTransactionNetworkTransactionIdNonceSelector instanceof arktype.errors)
		error(404, 'Invalid HederaTransaction selector')

	return {
		selector: hederaTransactionNetworkTransactionIdNonceSelector,
	}
}
