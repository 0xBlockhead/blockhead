// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const libtorrentSessionRestSourceDefinition = {
	provider: SourceProvider.LibtorrentSession,
	source: Source.LibtorrentSession_Rest,
	label: 'libtorrent session REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default libtorrentSessionRestSourceDefinition
