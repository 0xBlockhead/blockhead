// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import IcpCanisterSchema from '$/schema/IcpCanister.ts'
import IcpLedgerCanisterSchema from '$/schema/IcpLedgerCanister.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['InternetComputer']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'InternetComputer'))
		error(404, 'Route mapping not applicable')

	const icpCanisterNetworkCanisterIdParentSelector = parseRouteEntitySelector(
		schema,
		IcpCanisterSchema,
		parentData.selector,
		'NetworkCanisterId'
	)
	if (icpCanisterNetworkCanisterIdParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const icpLedgerCanisterCanisterSelector = parseRouteEntitySelector(
		schema,
		IcpLedgerCanisterSchema,
		{
			$canister: icpCanisterNetworkCanisterIdParentSelector,
		},
		'Canister'
	)
	if (icpLedgerCanisterCanisterSelector instanceof arktype.errors)
		error(404, 'Invalid IcpLedgerCanister selector')

	return {
		selector: icpLedgerCanisterCanisterSelector,
	}
}
