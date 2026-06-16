import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import TronFullNodeRest from '$/sources/TronFullNode/Rest/index.ts'

export const tronFullNodeRestEndpoints = [
	{
		slug: 'full_node_local',
		restBaseUrl: 'http://127.0.0.1:8090',
	},
] as const satisfies readonly {
	slug: 'full_node_local'
	restBaseUrl: string
}[]

export default {
	provider: SourceProvider.TronFullNode,
	label: 'TRON FullNode',
	origins: tronFullNodeRestEndpoints.map((endpoint) => ({
		origin: endpoint.restBaseUrl,
		corsEnabled: false,
	})),
	sources: [
		TronFullNodeRest,
	],
} as const satisfies SourceProviderDefinition
