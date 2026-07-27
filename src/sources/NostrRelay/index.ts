// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/NostrRelay/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.NostrRelay,
	label: 'Nostr relay',
	sources: [
		{
			source: Source.NostrRelay_Nip11_Http,
			label: 'Nostr relay NIP-11 HTTP',
		},
		{
			source: Source.NostrRelay_WebSocket,
			label: 'Nostr relay WebSocket',
		},
	],
	bindings: [
		...bindings[Source.NostrRelay_Nip11_Http],
		...bindings[Source.NostrRelay_WebSocket],
	],
} satisfies SourceProviderDefinition
