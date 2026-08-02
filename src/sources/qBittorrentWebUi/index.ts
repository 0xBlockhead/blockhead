// Generated from APP.ts.

import bindings from '$/sources/qBittorrentWebUi/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.qBittorrentWebUi,
	label: 'qBittorrent WebUI',
	sources: {
		[Source.qBittorrentWebUi_Rest]: {
			label: 'qBittorrent WebUI REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
