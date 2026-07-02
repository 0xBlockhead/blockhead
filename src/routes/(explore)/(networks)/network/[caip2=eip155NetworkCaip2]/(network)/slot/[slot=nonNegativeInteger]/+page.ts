// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BeaconSlotSchema from '$/schema/BeaconSlot.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const beaconSlotSelector = parseEntitySelector(
		schema,
		BeaconSlotSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			slot: Number(params.slot),
		}
	)
	if (beaconSlotSelector instanceof arktype.errors) error(404, 'Invalid BeaconSlot selector')

	return {
		selector: beaconSlotSelector,
	}
}
