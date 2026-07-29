// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/qBittorrentWebUi/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.qBittorrentWebUi,
	label: 'qBittorrent WebUI',
	sources: [
		{
			source: Source.qBittorrentWebUi_Rest,
			label: 'qBittorrent WebUI REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
