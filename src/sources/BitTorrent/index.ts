import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { bitTorrentBindings } from '$/sources/BitTorrent/bindings.ts'

export default {
	provider: SourceProvider.BitTorrent,
	label: 'BitTorrent',
	sources: [
		{
			provider: SourceProvider.BitTorrent,
			source: Source.BitTorrentMetainfo_File,
			label: 'BitTorrent metainfo file',
		},
		{
			provider: SourceProvider.BitTorrent,
			source: Source.BitTorrent_HttpTracker,
			label: 'BitTorrent HTTP tracker',
		},
		{
			provider: SourceProvider.BitTorrent,
			source: Source.BitTorrent_UdpTracker,
			label: 'BitTorrent UDP tracker',
		},
		{
			provider: SourceProvider.BitTorrent,
			source: Source.BitTorrent_MainlineDht,
			label: 'BitTorrent Mainline DHT',
		},
		{
			provider: SourceProvider.BitTorrent,
			source: Source.BitTorrent_MetadataExchange,
			label: 'BitTorrent metadata exchange',
		},
		{
			provider: SourceProvider.BitTorrent,
			source: Source.BitTorrent_PeerWire,
			label: 'BitTorrent peer wire',
		},
	],
	bindings: bitTorrentBindings,
} satisfies SourceProviderDefinition
