import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { cometBftBindings } from '$/sources/CometBft/bindings.ts'

export const cometBftOrigins = [
	...new Map(
		cometBftBindings
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
	provider: SourceProvider.CometBft,
	label: 'CometBFT',
	sources: [
		{
			provider: SourceProvider.CometBft,
			source: Source.CometBft_Rest,
			label: 'CometBFT REST',
		},
	],
	bindings: cometBftBindings,
} satisfies SourceProviderDefinition
