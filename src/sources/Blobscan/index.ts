import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { blobscanBindings } from '$/sources/Blobscan/bindings.ts'

export const blobscanOrigins = [
	...new Map(
		blobscanBindings
			.flatMap((binding) => binding.endpoints)
			.flatMap((endpoint) => (
				endpoint.origin == null ?
					[]
				:
					[[
						endpoint.origin,
						{
							origin: endpoint.origin,
							corsEnabled: endpoint.corsEnabled === true,
						},
					]]
			))
	).values(),
]

export default {
	provider: SourceProvider.Blobscan,
	label: 'Blobscan',
	sources: [
		{
			provider: SourceProvider.Blobscan,
			source: Source.Blobscan_Rest,
			label: 'Blobscan REST',
		},
	],
	bindings: blobscanBindings,
} satisfies SourceProviderDefinition
