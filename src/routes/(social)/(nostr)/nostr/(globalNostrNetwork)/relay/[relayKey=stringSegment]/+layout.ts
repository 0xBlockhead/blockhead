// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import NostrRelaySchema from '$/schema/NostrRelay.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.relayKey)))
		error(404, 'Route mapping not applicable')

	const nostrRelayRelayUrlSelector = parseEntitySelector(
		schema,
		NostrRelaySchema,
		{
			relayUrl: decodeURIComponent(params.relayKey),
		},
		'RelayUrl'
	)
	if (nostrRelayRelayUrlSelector instanceof arktype.errors)
		error(404, 'Invalid NostrRelay selector')

	return {
		selector: nostrRelayRelayUrlSelector,
	}
}
