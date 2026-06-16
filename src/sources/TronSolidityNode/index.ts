import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import TronSolidityNodeRest from '$/sources/TronSolidityNode/Rest/index.ts'

export const tronSolidityNodeRestEndpoints = [
	{
		slug: 'solidity_node_local',
		restBaseUrl: 'http://127.0.0.1:8091',
	},
] as const satisfies readonly {
	slug: 'solidity_node_local'
	restBaseUrl: string
}[]

export default {
	provider: SourceProvider.TronSolidityNode,
	label: 'TRON SolidityNode',
	origins: tronSolidityNodeRestEndpoints.map((endpoint) => ({
		origin: endpoint.restBaseUrl,
		corsEnabled: false,
	})),
	sources: [
		TronSolidityNodeRest,
	],
} as const satisfies SourceProviderDefinition
