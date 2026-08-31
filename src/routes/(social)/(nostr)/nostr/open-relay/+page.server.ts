import { error, redirect, type RequestEvent } from '@sveltejs/kit'

import { relayWebSocketUrl } from '$/sources/NostrRelay/WebSocket/relayWebSocketUrl.ts'

export const load = ({ url }: Pick<RequestEvent, 'url'>) => {
	const relayUrl = url.searchParams.get('url')
	if (relayUrl == null)
		return {}

	let normalizedRelayUrl
	try {
		normalizedRelayUrl = relayWebSocketUrl(relayUrl)
	} catch (reason) {
		error(400, reason instanceof Error ? reason.message : 'Invalid Nostr relay URL')
	}

	redirect(303, `/nostr/relay/${encodeURIComponent(normalizedRelayUrl)}`)
}
