import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { Source } from '$/sources/Source.ts'
import { etherscanBindings } from '$/sources/Etherscan/bindings.ts'

export const etherscanOrigins = [
	...new Map(
		etherscanBindings
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
	provider: SourceProvider.Etherscan,
	label: 'Etherscan',
	sources: [
		{
			provider: SourceProvider.Etherscan,
			source: Source.Etherscan_Rest,
			label: 'Etherscan REST',
		},
	],
	bindings: etherscanBindings,
} satisfies SourceProviderDefinition
