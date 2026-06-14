import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import NostrReactionSchema from '$/schema/NostrReaction.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const entitySelector = NostrReactionSchema.id({
		eventId: decodeURIComponent(params.eventId).trim().toLowerCase(),
	})
	if (entitySelector instanceof arktype.errors) error(404, 'Invalid Nostr event id')
	return { entitySelector }
}
