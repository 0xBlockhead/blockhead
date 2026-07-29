// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/LibtorrentSession/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.LibtorrentSession,
	label: 'libtorrent session',
	sources: [
		{
			source: Source.LibtorrentSession_Rest,
			label: 'libtorrent session REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
