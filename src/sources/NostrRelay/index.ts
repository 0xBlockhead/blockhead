import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { nostrRelayBindings } from '$/sources/NostrRelay/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const nostrRelayOrigins = sourceOriginsFromBindings(nostrRelayBindings)

const nostrRelaySourceProviderDefinition = {
	provider: SourceProvider.NostrRelay,
	label: 'Nostr relay',
	sources: [
		{
			provider: SourceProvider.NostrRelay,
			source: Source.NostrRelay_Nip11_Http,
			label: 'Nostr relay NIP-11 HTTP',
		},
		{
			provider: SourceProvider.NostrRelay,
			source: Source.NostrRelay_WebSocket,
			label: 'Nostr relay WebSocket',
		},
	],
	bindings: nostrRelayBindings,
	origins: nostrRelayOrigins,
} satisfies SourceProviderDefinition

export default nostrRelaySourceProviderDefinition
