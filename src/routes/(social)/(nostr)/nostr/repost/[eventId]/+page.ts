import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import NostrRepostSchema from '$/schema/NostrRepost.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const entityId = NostrRepostSchema.id({
		eventId: decodeURIComponent(params.eventId).trim().toLowerCase(),
	})
	if (entityId instanceof arktype.errors) error(404, 'Invalid Nostr event id')
	return { entityId }
}
