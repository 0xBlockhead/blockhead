// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import NostrNoteSchema from '$/schema/NostrNote.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.eventId))) error(404, 'Route mapping not applicable')

	const nostrNoteCanonicalEventIdSelector = parseEntitySelector(
		schema,
		NostrNoteSchema,
		{
			eventId: params.eventId,
		}
	)
	if (nostrNoteCanonicalEventIdSelector instanceof arktype.errors) error(404, 'Invalid NostrNote selector')

	return {
		selector: nostrNoteCanonicalEventIdSelector,
	}
}
