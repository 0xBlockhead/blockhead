import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { lightningMempoolSpaceBindings } from '$/sources/LightningMempoolSpace/bindings.ts'

export const lightningMempoolSpaceOrigins = [
	...new Map(
		lightningMempoolSpaceBindings
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
	provider: SourceProvider.LightningMempoolSpace,
	label: 'mempool.space Lightning',
	sources: [
		{
			provider: SourceProvider.LightningMempoolSpace,
			source: Source.LightningMempoolSpace_Rest,
			label: 'mempool.space Lightning REST',
		},
	],
	bindings: lightningMempoolSpaceBindings,
} satisfies SourceProviderDefinition
