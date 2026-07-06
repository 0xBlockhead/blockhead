// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const nostrRelayNip11HttpSourceDefinition = {
	provider: SourceProvider.NostrRelay,
	source: Source.NostrRelay_Nip11_Http,
	label: 'Nostr relay NIP-11 HTTP',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default nostrRelayNip11HttpSourceDefinition
