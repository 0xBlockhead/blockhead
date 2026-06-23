import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { coingeckoBindings } from '$/sources/Coingecko/bindings.ts'

export const coingeckoOrigins = [
	...new Map(
		coingeckoBindings
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
	provider: SourceProvider.Coingecko,
	label: 'Coingecko',
	sources: [
		{
			provider: SourceProvider.Coingecko,
			source: Source.Coingecko_OpenApi,
			label: 'Coingecko OpenAPI',
		},
		{
			provider: SourceProvider.Coingecko,
			source: Source.Coingecko_Rest,
			label: 'Coingecko REST',
		},
	],
	bindings: coingeckoBindings,
} satisfies SourceProviderDefinition
