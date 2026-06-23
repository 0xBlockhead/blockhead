import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { cosmosSdkBindings } from '$/sources/CosmosSdk/bindings.ts'

export const cosmosSdkOrigins = [
	...new Map(
		cosmosSdkBindings
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
	provider: SourceProvider.CosmosSdk,
	label: 'Cosmos SDK',
	sources: [
		{
			provider: SourceProvider.CosmosSdk,
			source: Source.CosmosSdk_Rest,
			label: 'Cosmos SDK REST',
		},
	],
	bindings: cosmosSdkBindings,
} satisfies SourceProviderDefinition
