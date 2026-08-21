// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import ArweaveResourceSchema from '$/schema/ArweaveResource.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.transactionId) && matchStringSegment(params.contentPath)))
		error(404, 'Route mapping not applicable')

	const arweaveResourceTransactionIdContentPathSelector = parseEntitySelector(
		schema,
		ArweaveResourceSchema,
		{
			transactionId: params.transactionId,
			contentPath: params.contentPath,
		},
		'TransactionIdContentPath'
	)
	if (arweaveResourceTransactionIdContentPathSelector instanceof arktype.errors)
		error(404, 'Invalid ArweaveResource selector')

	return {
		selector: arweaveResourceTransactionIdContentPathSelector,
	}
}
