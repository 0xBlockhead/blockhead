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
			source: Source.BitTorrent,
			label: 'BitTorrent',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
