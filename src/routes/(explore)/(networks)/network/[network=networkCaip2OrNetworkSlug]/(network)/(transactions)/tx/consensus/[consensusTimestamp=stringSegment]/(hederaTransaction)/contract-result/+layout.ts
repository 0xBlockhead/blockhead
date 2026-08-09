// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import HederaContractResultSchema from '$/schema/HederaContractResult.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Hedera']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Hedera'))
		error(404, 'Route mapping not applicable')

	const hederaContractResultTransactionSelector = parseEntitySelector(
		schema,
		HederaContractResultSchema,
		{
			$transaction: parentData.selector,
		},
		'Transaction'
	)
	if (hederaContractResultTransactionSelector instanceof arktype.errors)
		error(404, 'Invalid HederaContractResult selector')

	return {
		selector: hederaContractResultTransactionSelector,
	}
}
