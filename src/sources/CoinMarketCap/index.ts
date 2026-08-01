// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/CoinMarketCap/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.CoinMarketCap,
	label: 'Coin Market Cap',
	sources: [
		{
			source: Source.CoinMarketCap_Rest,
			label: 'Coin Market Cap REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
