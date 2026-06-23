import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { webTorrentBindings } from '$/sources/WebTorrent/bindings.ts'

export default {
	provider: SourceProvider.WebTorrent,
	label: 'WebTorrent',
	sources: [
		{
			provider: SourceProvider.WebTorrent,
			source: Source.WebTorrent_Client,
			label: 'WebTorrent client',
		},
		{
			provider: SourceProvider.WebTorrent,
			source: Source.WebTorrent_Dht,
			label: 'WebTorrent DHT',
		},
		{
			provider: SourceProvider.WebTorrent,
			source: Source.WebTorrent_Tracker,
			label: 'WebTorrent tracker',
		},
	],
	bindings: webTorrentBindings,
} satisfies SourceProviderDefinition
