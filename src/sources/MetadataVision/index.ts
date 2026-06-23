import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { metadataVisionBindings } from '$/sources/MetadataVision/bindings.ts'

export const metadataVisionOrigins = [
	...new Map(
		metadataVisionBindings
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
	provider: SourceProvider.MetadataVision,
	label: 'Metadata Vision',
	sources: [
		{
			provider: SourceProvider.MetadataVision,
			source: Source.MetadataVision_Rest,
			label: 'Metadata Vision Open Graph',
		},
	],
	bindings: metadataVisionBindings,
} satisfies SourceProviderDefinition
