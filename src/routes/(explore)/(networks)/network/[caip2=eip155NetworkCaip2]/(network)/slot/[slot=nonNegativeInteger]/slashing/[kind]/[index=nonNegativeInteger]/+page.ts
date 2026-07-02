// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BeaconSlashingSchema from '$/schema/BeaconSlashing.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const beaconSlashingSelector = parseEntitySelector(
		schema,
		BeaconSlashingSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			slot: Number(params.slot),
			kind: decodeURIComponent(params.kind),
			indexInSlot: Number(params.index),
		}
	)
	if (beaconSlashingSelector instanceof arktype.errors) error(404, 'Invalid BeaconSlashing selector')

	return {
		selector: beaconSlashingSelector,
	}
}
