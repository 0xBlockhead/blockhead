// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BeaconValidatorSchema from '$/schema/BeaconValidator.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const beaconValidatorSelector = parseEntitySelector(
		schema,
		BeaconValidatorSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			indexInNetwork: Number(params.validatorIndex),
		}
	)
	if (beaconValidatorSelector instanceof arktype.errors) error(404, 'Invalid BeaconValidator selector')

	return {
		selector: beaconValidatorSelector,
	}
}
