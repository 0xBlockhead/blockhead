// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import IcpLedgerCanisterSchema from '$/schema/IcpLedgerCanister.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['InternetComputer']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'InternetComputer'))
		error(404, 'Route mapping not applicable')

	const icpLedgerCanisterCanisterSelector = parseEntitySelector(
		schema,
		IcpLedgerCanisterSchema,
		{
			$canister: parentData.selector,
		},
		'Canister'
	)
	if (icpLedgerCanisterCanisterSelector instanceof arktype.errors)
		error(404, 'Invalid IcpLedgerCanister selector')

	return {
		selector: icpLedgerCanisterCanisterSelector,
	}
}
