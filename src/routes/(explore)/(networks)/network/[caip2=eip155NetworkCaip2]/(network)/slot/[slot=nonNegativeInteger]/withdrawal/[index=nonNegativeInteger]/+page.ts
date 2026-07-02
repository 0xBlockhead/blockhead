// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BeaconWithdrawalSchema from '$/schema/BeaconWithdrawal.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const beaconWithdrawalSelector = parseEntitySelector(
		schema,
		BeaconWithdrawalSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			slot: Number(params.slot),
			indexInSlot: Number(params.index),
		}
	)
	if (beaconWithdrawalSelector instanceof arktype.errors) error(404, 'Invalid BeaconWithdrawal selector')

	return {
		selector: beaconWithdrawalSelector,
	}
}
