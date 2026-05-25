import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import NostrProfileSchema from '$/schema/NostrProfile.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const entityId = NostrProfileSchema.id({
		pubkey: decodeURIComponent(params.pubkey).trim().toLowerCase(),
	})
	if (entityId instanceof arktype.errors) error(404, 'Invalid Nostr pubkey')
	return { entityId }
}
