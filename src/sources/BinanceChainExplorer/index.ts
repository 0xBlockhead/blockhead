// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/BinanceChainExplorer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.BinanceChainExplorer,
	label: 'Binance Chain Explorer',
	sources: [
		{
			source: Source.BinanceChainExplorer_Rest,
			label: 'Binance Chain Explorer REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
