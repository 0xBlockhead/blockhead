import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { ethereumListsBindings } from '$/sources/EthereumLists/bindings.ts'

export const ethereumListsOrigins = [
	...new Map(
		ethereumListsBindings
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
	provider: SourceProvider.EthereumLists,
	label: 'ethereum-lists (chainid.network)',
	sources: [
		{
			provider: SourceProvider.EthereumLists,
			source: Source.EthereumLists_Rest,
			label: 'ethereum-lists REST',
		},
	],
	bindings: ethereumListsBindings,
} satisfies SourceProviderDefinition
