// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/BitTorrent/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.BitTorrent,
	label: 'BitTorrent',
	sources: [
		{
			source: Source.BitTorrentMetainfo_File,
			label: 'BitTorrent metainfo file',
		},
		{
			source: Source.BitTorrent_HttpTracker,
			label: 'BitTorrent HTTP tracker',
		},
		{
			source: Source.BitTorrent_UdpTracker,
			label: 'BitTorrent UDP tracker',
		},
		{
			source: Source.BitTorrent_MainlineDht,
			label: 'BitTorrent Mainline DHT',
		},
		{
			source: Source.BitTorrent_MetadataExchange,
			label: 'BitTorrent metadata exchange',
		},
		{
			source: Source.BitTorrent_PeerWire,
			label: 'BitTorrent peer wire',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
