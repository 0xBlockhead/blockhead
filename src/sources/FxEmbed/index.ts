import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { fxEmbedBindings } from '$/sources/FxEmbed/bindings.ts'

export const fxEmbedOrigins = [
	...new Map(
		fxEmbedBindings
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
	provider: SourceProvider.FxEmbed,
	label: 'FxEmbed',
	sources: [
		{
			provider: SourceProvider.FxEmbed,
			source: Source.X_FxEmbed_Rest,
			label: 'FxEmbed REST',
		},
	],
	bindings: fxEmbedBindings,
} satisfies SourceProviderDefinition
