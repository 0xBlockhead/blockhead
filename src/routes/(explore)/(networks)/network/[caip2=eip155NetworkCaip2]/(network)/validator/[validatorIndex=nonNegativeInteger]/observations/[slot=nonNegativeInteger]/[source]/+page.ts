// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BeaconValidator_TimestampSchema from '$/schema/BeaconValidator_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const beaconValidatorTimestampSelector = parseEntitySelector(
		schema,
		BeaconValidator_TimestampSchema,
		{
			$validator: {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				indexInNetwork: Number(params.validatorIndex),
			},
			slot: Number(params.slot),
			source: decodeURIComponent(params.source),
		}
	)
	if (beaconValidatorTimestampSelector instanceof arktype.errors) error(404, 'Invalid BeaconValidator_Timestamp selector')

	return {
		selector: beaconValidatorTimestampSelector,
	}
}
