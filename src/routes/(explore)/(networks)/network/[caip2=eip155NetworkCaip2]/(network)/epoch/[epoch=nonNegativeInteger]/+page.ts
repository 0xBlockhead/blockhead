// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BeaconEpochSchema from '$/schema/BeaconEpoch.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const beaconEpochSelector = parseEntitySelector(
		schema,
		BeaconEpochSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			epoch: Number(params.epoch),
		}
	)
	if (beaconEpochSelector instanceof arktype.errors) error(404, 'Invalid BeaconEpoch selector')

	return {
		selector: beaconEpochSelector,
	}
}
