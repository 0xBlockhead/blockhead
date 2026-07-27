// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
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
	bindings: [
		bindings[Source.WebTorrent_Client],
		bindings[Source.WebTorrent_Dht],
		bindings[Source.WebTorrent_Tracker],
	],
} satisfies SourceProviderDefinition
