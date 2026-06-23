import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { qBittorrentWebUiBindings } from '$/sources/qBittorrentWebUi/bindings.ts'

export default {
	provider: SourceProvider.qBittorrentWebUi,
	label: 'qBittorrent WebUI',
	sources: [
		{
			provider: SourceProvider.qBittorrentWebUi,
			source: Source.qBittorrentWebUi_Rest,
			label: 'qBittorrent WebUI REST',
		},
	],
	bindings: qBittorrentWebUiBindings,
} satisfies SourceProviderDefinition
