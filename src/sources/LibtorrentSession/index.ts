import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { libtorrentSessionBindings } from '$/sources/LibtorrentSession/bindings.ts'

export default {
	provider: SourceProvider.LibtorrentSession,
	label: 'libtorrent session',
	sources: [
		{
			provider: SourceProvider.LibtorrentSession,
			source: Source.LibtorrentSession_Rest,
			label: 'libtorrent session REST',
		},
	],
	bindings: libtorrentSessionBindings,
} satisfies SourceProviderDefinition
