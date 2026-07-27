// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/CoinMarketCap/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import { type as arktype } from 'arktype'

export default {
	provider: SourceProvider.CoinMarketCap,
	label: 'Coin Market Cap',
	env: arktype({
		'PUBLIC_COINMARKETCAP_API_KEY': 'string > 0',
	}),
	sources: [
		{
			source: Source.CoinMarketCap_Rest,
			label: 'Coin Market Cap REST',
			env: arktype({
				'PUBLIC_COINMARKETCAP_API_KEY': 'string > 0',
			}),
		},
	],
	bindings: [bindings[Source.CoinMarketCap_Rest]],
} satisfies SourceProviderDefinition
