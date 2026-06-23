import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import {
	tronFullNodeBindings,
	tronFullNodePublicEnv,
} from '$/sources/TronFullNode/bindings.ts'

export const tronFullNodeRestEndpoints = [
	{
		slug: 'full_node_local',
		restBaseUrl: tronFullNodeBindings[0].endpoints[0].locator,
	},
] as const satisfies readonly {
	slug: 'full_node_local'
	restBaseUrl: string
}[]

export const tronFullNodeOrigins = [
	...new Map(
		tronFullNodeBindings
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
	provider: SourceProvider.TronFullNode,
	label: 'TRON FullNode',
	env: tronFullNodePublicEnv,
	sources: [
		{
			provider: SourceProvider.TronFullNode,
			source: Source.TronFullNode_Rest,
			label: 'TRON FullNode REST',
			env: tronFullNodePublicEnv,
		},
	],
	bindings: tronFullNodeBindings,
} satisfies SourceProviderDefinition
