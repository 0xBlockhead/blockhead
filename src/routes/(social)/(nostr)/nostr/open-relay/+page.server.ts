import { resolve } from '$app/paths'
import { error, redirect } from '@sveltejs/kit'

import { relayWebSocketUrl } from '$/sources/NostrRelay/WebSocket/queries.ts'

import type { PageServerLoad } from './$types.ts'


export const load: PageServerLoad = ({ url }) => {
	const relayUrl = url.searchParams.get('url')
	if (relayUrl == null)
		return {}

	let normalizedRelayUrl
	try {
		normalizedRelayUrl = relayWebSocketUrl(relayUrl)
	} catch (reason) {
		error(400, reason instanceof Error ? reason.message : 'Invalid Nostr relay URL')
	}

	redirect(303, resolve(`/nostr/relay/${encodeURIComponent(normalizedRelayUrl)}`))
}
