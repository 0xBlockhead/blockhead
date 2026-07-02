// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BeaconSyncCommitteeSchema from '$/schema/BeaconSyncCommittee.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const beaconSyncCommitteeSelector = parseEntitySelector(
		schema,
		BeaconSyncCommitteeSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			period: Number(params.period),
		}
	)
	if (beaconSyncCommitteeSelector instanceof arktype.errors) error(404, 'Invalid BeaconSyncCommittee selector')

	return {
		selector: beaconSyncCommitteeSelector,
	}
}
