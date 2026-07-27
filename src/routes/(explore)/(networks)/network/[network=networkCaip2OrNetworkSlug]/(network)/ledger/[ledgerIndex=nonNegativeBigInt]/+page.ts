// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import XrplLedgerSchema from '$/schema/XrplLedger.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Xrpl']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

	if (!(projectionNetwork.namespace === 'Xrpl' && matchNonNegativeBigInt(params.ledgerIndex))) error(404, 'Route mapping not applicable')

	const xrplLedgerNetworkLedgerIndexSelector = parseEntitySelector(
		schema,
		XrplLedgerSchema,
		{
			$network: parentData.selector,
			ledgerIndex: BigInt(params.ledgerIndex),
		}
	)
	if (xrplLedgerNetworkLedgerIndexSelector instanceof arktype.errors) error(404, 'Invalid XrplLedger selector')

	return {
		selector: xrplLedgerNetworkLedgerIndexSelector,
	}
}
