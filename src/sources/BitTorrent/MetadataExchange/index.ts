// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const bitTorrentMetadataExchangeSourceDefinition = {
	provider: SourceProvider.BitTorrent,
	source: Source.BitTorrent_MetadataExchange,
	label: 'BitTorrent metadata exchange',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default bitTorrentMetadataExchangeSourceDefinition
