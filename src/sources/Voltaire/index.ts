
import { type SourceProviderDefinition, SourceProvider } from '$/sources/SourceProvider.ts'
import { executionHttpRpcOrigins } from '$/constants/ExecutionRpcOrigins.ts'
import VoltaireJsonRpcSource from '$/sources/Voltaire/JsonRpc/index.ts'

export default {
	provider: SourceProvider.Voltaire,
	label: 'Voltaire',
	origins: executionHttpRpcOrigins,
	sources: [
		VoltaireJsonRpcSource,
	],
} satisfies SourceProviderDefinition
