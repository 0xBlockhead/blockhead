// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BeaconSlotSchema from '$/schema/BeaconSlot.ts'
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
		&& matchNonNegativeInteger(params.slot)
	))
		error(404, 'Route mapping not applicable')

	const beaconSlotEvmNetworkSlotSelector = parseEntitySelector(
		schema,
		BeaconSlotSchema,
		{
			$network: parentData.selector,
			slot: Number(params.slot),
		}
	)
	if (beaconSlotEvmNetworkSlotSelector instanceof arktype.errors)
		error(404, 'Invalid BeaconSlot selector')

	return {
		selector: beaconSlotEvmNetworkSlotSelector,
	}
}
