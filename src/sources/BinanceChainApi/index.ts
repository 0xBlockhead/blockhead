// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/BinanceChainApi/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.BinanceChainApi,
	label: 'Binance Chain API',
	sources: [
		{
			source: Source.BinanceChainApi_Rest,
			label: 'Binance Chain API REST',
		},
	],
	bindings: [bindings[Source.BinanceChainApi_Rest]],
} satisfies SourceProviderDefinition
