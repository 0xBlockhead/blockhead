// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/WebTorrent/bindings.ts'

export default {
	provider: SourceProvider.WebTorrent,
	label: 'WebTorrent',
	sources: [
		{
			source: Source.WebTorrent_Client,
			label: 'WebTorrent client',
		},
		{
			source: Source.WebTorrent_Dht,
			label: 'WebTorrent DHT',
		},
		{
			source: Source.WebTorrent_Tracker,
			label: 'WebTorrent tracker',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
