// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import NostrRelaySchema from '$/schema/NostrRelay.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const nostrRelaySelector = parseEntitySelector(
		schema,
		NostrRelaySchema,
		{
			relayUrl: decodeURIComponent(params.relayKey),
		}
	)
	if (nostrRelaySelector instanceof arktype.errors) error(404, 'Invalid NostrRelay selector')

	return {
		selector: nostrRelaySelector,
	}
}
