// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/BinanceChainExplorer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.BinanceChainExplorer,
	label: 'Binance Chain Explorer',
	sources: [
		{
			source: Source.BinanceChainExplorer_Rest,
			label: 'Binance Chain Explorer REST',
		},
	],
	bindings: [bindings[Source.BinanceChainExplorer_Rest]],
} satisfies SourceProviderDefinition
