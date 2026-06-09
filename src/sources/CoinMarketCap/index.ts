import { type as arktype } from 'arktype'

import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/SourceProvider.ts'
import { origin } from '$/sources/CoinMarketCap/Rest/constants.ts'
import CoinMarketCapRestSource from '$/sources/CoinMarketCap/Rest/index.ts'

export default {
	provider: SourceProvider.CoinMarketCap,
	label: 'Coin Market Cap',
	env: arktype({
		PUBLIC_COINMARKETCAP_API_KEY: 'string > 0',
	}),
	origins: [
		{
			origin,
			corsEnabled: false,
		},
	],
	sources: [
		CoinMarketCapRestSource,
	],
} satisfies SourceProviderDefinition
