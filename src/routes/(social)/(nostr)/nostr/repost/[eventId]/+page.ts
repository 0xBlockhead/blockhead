// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import NostrRepostSchema from '$/schema/NostrRepost.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const nostrRepostSelector = parseEntitySelector(
		schema,
		NostrRepostSchema,
		{
			eventId: decodeURIComponent(params.eventId),
		}
	)
	if (nostrRepostSelector instanceof arktype.errors) error(404, 'Invalid NostrRepost selector')

	return {
		selector: nostrRepostSelector,
	}
}
