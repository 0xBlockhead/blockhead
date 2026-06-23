import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { mevRelayBindings } from '$/sources/MevRelay/bindings.ts'

export const mevRelayOrigins = [
	...new Map(
		mevRelayBindings
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
	provider: SourceProvider.MevRelay,
	label: 'MEV-Boost relay',
	sources: [
		{
			provider: SourceProvider.MevRelay,
			source: Source.MevRelay_Rest,
			label: 'MEV-Boost relay REST',
		},
	],
	bindings: mevRelayBindings,
} satisfies SourceProviderDefinition
