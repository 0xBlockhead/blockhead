// Generated from APP.ts.

import bindings from '$/sources/NostrRelay/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

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
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
