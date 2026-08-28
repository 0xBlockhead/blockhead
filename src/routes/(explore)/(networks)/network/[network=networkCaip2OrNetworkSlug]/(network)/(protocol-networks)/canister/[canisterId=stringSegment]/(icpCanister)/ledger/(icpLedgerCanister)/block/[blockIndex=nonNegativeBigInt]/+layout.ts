// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import IcpLedgerBlockSchema from '$/schema/IcpLedgerBlock.ts'
import IcpLedgerCanisterSchema from '$/schema/IcpLedgerCanister.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['InternetComputer']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'InternetComputer' && matchNonNegativeBigInt(params.blockIndex)))
		error(404, 'Route mapping not applicable')

	const icpLedgerCanisterCanisterParentSelector = parseRouteEntitySelector(
		schema,
		IcpLedgerCanisterSchema,
		parentData.selector,
		'Canister'
	)
	if (icpLedgerCanisterCanisterParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const icpLedgerBlockLedgerBlockIndexSelector = parseRouteEntitySelector(
		schema,
		IcpLedgerBlockSchema,
		{
			$ledger: icpLedgerCanisterCanisterParentSelector,
			blockIndex: BigInt(params.blockIndex),
		},
		'LedgerBlockIndex'
	)
	if (icpLedgerBlockLedgerBlockIndexSelector instanceof arktype.errors)
		error(404, 'Invalid IcpLedgerBlock selector')

	return {
		selector: icpLedgerBlockLedgerBlockIndexSelector,
	}
}
