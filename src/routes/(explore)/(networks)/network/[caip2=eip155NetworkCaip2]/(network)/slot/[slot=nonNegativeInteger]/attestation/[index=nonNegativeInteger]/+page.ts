// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BeaconAttestationSchema from '$/schema/BeaconAttestation.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const beaconAttestationSelector = parseEntitySelector(
		schema,
		BeaconAttestationSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			slot: Number(params.slot),
			indexInSlot: Number(params.index),
		}
	)
	if (beaconAttestationSelector instanceof arktype.errors) error(404, 'Invalid BeaconAttestation selector')

	return {
		selector: beaconAttestationSelector,
	}
}
