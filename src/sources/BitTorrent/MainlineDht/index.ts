// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const bitTorrentMainlineDhtSourceDefinition = {
	provider: SourceProvider.BitTorrent,
	source: Source.BitTorrent_MainlineDht,
	label: 'BitTorrent Mainline DHT',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default bitTorrentMainlineDhtSourceDefinition
