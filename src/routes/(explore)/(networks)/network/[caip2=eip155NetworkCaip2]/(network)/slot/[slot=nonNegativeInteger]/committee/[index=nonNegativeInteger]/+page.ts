// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BeaconCommitteeSchema from '$/schema/BeaconCommittee.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const beaconCommitteeSelector = parseEntitySelector(
		schema,
		BeaconCommitteeSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			slot: Number(params.slot),
			indexInSlot: Number(params.index),
		}
	)
	if (beaconCommitteeSelector instanceof arktype.errors) error(404, 'Invalid BeaconCommittee selector')

	return {
		selector: beaconCommitteeSelector,
	}
}
