// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition } from '$/sources/index.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.NostrRelay,
	source: Source.NostrRelay_Nip11_Http,
	label: 'Nostr relay NIP-11 HTTP',
} satisfies SourceDefinition
