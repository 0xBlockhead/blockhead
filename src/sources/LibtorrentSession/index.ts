// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/LibtorrentSession/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.LibtorrentSession,
	label: 'libtorrent session',
	sources: [
		{
			source: Source.LibtorrentSession_Rest,
			label: 'libtorrent session REST',
		},
	],
	bindings: [bindings[Source.LibtorrentSession_Rest]],
} satisfies SourceProviderDefinition
