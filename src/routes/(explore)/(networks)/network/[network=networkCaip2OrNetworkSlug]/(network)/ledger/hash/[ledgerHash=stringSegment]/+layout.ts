// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import XrplLedgerSchema from '$/schema/XrplLedger.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Xrpl']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Xrpl' && matchStringSegment(params.ledgerHash)))
		error(404, 'Route mapping not applicable')

	const xrplLedgerNetworkLedgerHashSelector = parseRouteEntitySelector(
		schema,
		XrplLedgerSchema,
		{
			$network: parentData.selector,
			ledgerHash: params.ledgerHash,
		},
		'NetworkLedgerHash'
	)
	if (xrplLedgerNetworkLedgerHashSelector instanceof arktype.errors)
		error(404, 'Invalid XrplLedger selector')

	return {
		selector: xrplLedgerNetworkLedgerHashSelector,
	}
}
