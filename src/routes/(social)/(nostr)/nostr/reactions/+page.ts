import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import NostrNoteSchema from '$/schema/NostrNote.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ url }) => {
	const noteEventId = url.searchParams.get('note')?.trim().toLowerCase()
	if (!noteEventId) return { noteEntityId: null }
	const noteEntityId = NostrNoteSchema.id({ eventId: noteEventId })
	if (noteEntityId instanceof arktype.errors) error(404, 'Invalid Nostr event id')
	return { noteEntityId }
}
