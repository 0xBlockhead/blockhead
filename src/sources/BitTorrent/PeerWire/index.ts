// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const bitTorrentPeerWireSourceDefinition = {
	provider: SourceProvider.BitTorrent,
	source: Source.BitTorrent_PeerWire,
	label: 'BitTorrent peer wire',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default bitTorrentPeerWireSourceDefinition
