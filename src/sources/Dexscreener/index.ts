import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { dexscreenerBindings } from '$/sources/Dexscreener/bindings.ts'

export const dexscreenerOrigins = [
	...new Map(
		dexscreenerBindings
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
	provider: SourceProvider.Dexscreener,
	label: 'Dexscreener',
	sources: [
		{
			provider: SourceProvider.Dexscreener,
			source: Source.Dexscreener_OpenApi,
			label: 'Dexscreener OpenAPI',
		},
	],
	bindings: dexscreenerBindings,
} satisfies SourceProviderDefinition
