import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import NostrRelaySchema from '$/schema/NostrRelay.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const relayUrl = decodeURIComponent(params.relayKey).trim()
	if (!relayUrl.toLowerCase().startsWith('wss://')) error(404, 'Invalid Nostr relay URL')
	const entityId = NostrRelaySchema.id({ relayUrl })
	if (entityId instanceof arktype.errors) error(404, 'Invalid Nostr relay URL')
	return { entityId }
}
