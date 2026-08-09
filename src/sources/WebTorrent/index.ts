import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/WebTorrent/bindings.ts'

export default {
	provider: SourceProvider.WebTorrent,
	label: 'WebTorrent',
	sources: {
		[Source.WebTorrent_Client]: {
			label: 'WebTorrent client',
		},
		[Source.WebTorrent_Dht]: {
			label: 'WebTorrent DHT',
		},
		[Source.WebTorrent_Tracker]: {
			label: 'WebTorrent tracker',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
