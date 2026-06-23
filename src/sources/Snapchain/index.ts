import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { snapchainBindings } from '$/sources/Snapchain/bindings.ts'

export const snapchainOrigins = [
	...new Map(
		snapchainBindings
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
	provider: SourceProvider.Snapchain,
	label: 'Snapchain',
	sources: [
		{
			provider: SourceProvider.Snapchain,
			source: Source.Snapchain_Rest,
			label: 'Snapchain REST',
		},
	],
	bindings: snapchainBindings,
} satisfies SourceProviderDefinition
