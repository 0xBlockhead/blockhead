import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import {
	coinMarketCapBindings,
	coinMarketCapPublicEnv,
} from '$/sources/CoinMarketCap/bindings.ts'

export const coinMarketCapOrigins = [
	...new Map(
		coinMarketCapBindings
			.flatMap((binding) => binding.endpoints)
			.map((endpoint) => [
				endpoint.origin,
				{
					origin: endpoint.origin,
					corsEnabled: endpoint.corsEnabled,
				},
			])
	).values(),
]

export default {
	provider: SourceProvider.CoinMarketCap,
	label: 'Coin Market Cap',
	env: coinMarketCapPublicEnv,
	sources: [
		{
			provider: SourceProvider.CoinMarketCap,
			source: Source.CoinMarketCap_Rest,
			label: 'Coin Market Cap REST',
			env: coinMarketCapPublicEnv,
		},
	],
	bindings: coinMarketCapBindings,
} satisfies SourceProviderDefinition
