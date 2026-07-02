// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import MevRelay_ProposerPayloadDeliveredSchema from '$/schema/MevRelay_ProposerPayloadDelivered.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const mevRelayProposerPayloadDeliveredSelector = parseEntitySelector(
		schema,
		MevRelay_ProposerPayloadDeliveredSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			relayHost: decodeURIComponent(params.relayHost),
			slot: Number(params.slot),
			blockHash: decodeURIComponent(params.blockHash),
		}
	)
	if (mevRelayProposerPayloadDeliveredSelector instanceof arktype.errors) error(404, 'Invalid MevRelay_ProposerPayloadDelivered selector')

	return {
		selector: mevRelayProposerPayloadDeliveredSelector,
	}
}
