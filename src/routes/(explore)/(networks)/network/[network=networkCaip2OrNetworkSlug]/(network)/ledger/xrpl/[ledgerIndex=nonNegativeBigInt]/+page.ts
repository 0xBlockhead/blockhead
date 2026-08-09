// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import XrplLedgerSchema from '$/schema/XrplLedger.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Xrpl']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Xrpl' && matchNonNegativeBigInt(params.ledgerIndex)))
		error(404, 'Route mapping not applicable')

	const xrplLedgerNetworkLedgerIndexSelector = parseEntitySelector(
		schema,
		XrplLedgerSchema,
		{
			$network: parentData.selector,
			ledgerIndex: BigInt(params.ledgerIndex),
		},
		'NetworkLedgerIndex'
	)
	if (xrplLedgerNetworkLedgerIndexSelector instanceof arktype.errors)
		error(404, 'Invalid XrplLedger selector')

	return {
		selector: xrplLedgerNetworkLedgerIndexSelector,
	}
}
