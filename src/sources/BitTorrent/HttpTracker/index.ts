// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const bitTorrentHttpTrackerSourceDefinition = {
	provider: SourceProvider.BitTorrent,
	source: Source.BitTorrent_HttpTracker,
	label: 'BitTorrent HTTP tracker',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default bitTorrentHttpTrackerSourceDefinition
