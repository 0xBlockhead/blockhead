import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { bittensorBindings } from '$/sources/Bittensor/bindings.ts'

export const bittensorOrigins = [
	...new Map(
		bittensorBindings
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
	provider: SourceProvider.Bittensor,
	label: 'Bittensor',
	sources: [
		{
			provider: SourceProvider.Bittensor,
			source: Source.Bittensor_JsonRpc,
			label: 'Bittensor JSON-RPC',
		},
	],
	bindings: bittensorBindings,
} satisfies SourceProviderDefinition
