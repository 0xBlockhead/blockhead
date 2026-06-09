import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import TronFullNodeRest from '$/sources/TronFullNode/Rest/index.ts'

export default {
	provider: SourceProvider.TronFullNode,
	label: 'TRON FullNode',
	origins: [
		{
			origin: 'http://127.0.0.1:8090',
			corsEnabled: false,
		},
	],
	sources: [
		TronFullNodeRest,
	],
} as const satisfies SourceProviderDefinition
