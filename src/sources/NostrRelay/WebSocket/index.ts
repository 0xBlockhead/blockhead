// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const nostrRelayWebSocketSourceDefinition = {
	provider: SourceProvider.NostrRelay,
	source: Source.NostrRelay_WebSocket,
	label: 'Nostr relay WebSocket',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default nostrRelayWebSocketSourceDefinition
