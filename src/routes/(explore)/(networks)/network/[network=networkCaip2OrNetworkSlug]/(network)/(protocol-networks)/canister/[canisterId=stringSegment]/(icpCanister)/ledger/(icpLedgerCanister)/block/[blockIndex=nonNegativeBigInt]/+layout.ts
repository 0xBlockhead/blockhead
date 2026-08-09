// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import IcpLedgerBlockSchema from '$/schema/IcpLedgerBlock.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['InternetComputer']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'InternetComputer' && matchNonNegativeBigInt(params.blockIndex)))
		error(404, 'Route mapping not applicable')

	const icpLedgerBlockLedgerBlockIndexSelector = parseEntitySelector(
		schema,
		IcpLedgerBlockSchema,
		{
			$ledger: parentData.selector,
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
