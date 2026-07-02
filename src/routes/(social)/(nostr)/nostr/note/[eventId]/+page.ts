// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import NostrNoteSchema from '$/schema/NostrNote.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const nostrNoteSelector = parseEntitySelector(
		schema,
		NostrNoteSchema,
		{
			eventId: decodeURIComponent(params.eventId),
		}
	)
	if (nostrNoteSelector instanceof arktype.errors) error(404, 'Invalid NostrNote selector')

	return {
		selector: nostrNoteSelector,
	}
}
