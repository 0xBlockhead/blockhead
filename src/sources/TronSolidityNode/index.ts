import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import {
	tronSolidityNodeBindings,
	tronSolidityNodePublicEnv,
} from '$/sources/TronSolidityNode/bindings.ts'

export const tronSolidityNodeRestEndpoints = [
	{
		slug: 'solidity_node_local',
		restBaseUrl: tronSolidityNodeBindings[0].endpoints[0].locator,
	},
] as const satisfies readonly {
	slug: 'solidity_node_local'
	restBaseUrl: string
}[]

export const tronSolidityNodeOrigins = [
	...new Map(
		tronSolidityNodeBindings
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
	provider: SourceProvider.TronSolidityNode,
	label: 'TRON SolidityNode',
	env: tronSolidityNodePublicEnv,
	sources: [
		{
			provider: SourceProvider.TronSolidityNode,
			source: Source.TronSolidityNode_Rest,
			label: 'TRON SolidityNode REST',
			env: tronSolidityNodePublicEnv,
		},
	],
	bindings: tronSolidityNodeBindings,
} satisfies SourceProviderDefinition
