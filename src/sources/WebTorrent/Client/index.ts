// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const webTorrentClientSourceDefinition = {
	provider: SourceProvider.WebTorrent,
	source: Source.WebTorrent_Client,
	label: 'WebTorrent client',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default webTorrentClientSourceDefinition
