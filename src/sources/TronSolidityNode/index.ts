import { SourceProvider, type SourceProviderDefinition } from '$/sources/$SourceProvider.ts'
import TronSolidityNodeRest from '$/sources/TronSolidityNode/Rest/index.ts'

export default {
	provider: SourceProvider.TronSolidityNode,
	label: 'TRON SolidityNode',
	origins: [
		{
			origin: 'http://127.0.0.1:8091',
			corsEnabled: false,
		},
	],
	sources: [
		TronSolidityNodeRest,
	],
} as const satisfies SourceProviderDefinition
