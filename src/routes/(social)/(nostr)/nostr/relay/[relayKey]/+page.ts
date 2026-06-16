import { error } from '@sveltejs/kit'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const relayUrl = decodeURIComponent(params.relayKey).trim()
	if (!relayUrl.toLowerCase().startsWith('wss://')) error(404, 'Invalid Nostr relay URL')
	return {
		selector: { relayUrl },
	}
}
