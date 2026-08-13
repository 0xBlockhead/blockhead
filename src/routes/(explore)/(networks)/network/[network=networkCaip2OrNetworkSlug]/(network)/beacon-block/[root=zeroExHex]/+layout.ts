// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BeaconBlockSchema from '$/schema/BeaconBlock.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			parentData.projectionNetwork.executionModels !== undefined
			&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
		)
		&& matchZeroExHex(params.root)
	))
		error(404, 'Route mapping not applicable')

	const beaconBlockNetworkRootSelector = parseEntitySelector(
		schema,
		BeaconBlockSchema,
		{
			$network: parentData.selector,
			root: params.root,
		},
		'NetworkRoot'
	)
	if (beaconBlockNetworkRootSelector instanceof arktype.errors)
		error(404, 'Invalid BeaconBlock selector')

	return {
		selector: beaconBlockNetworkRootSelector,
	}
}
