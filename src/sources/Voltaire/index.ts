
import { type SourceProviderDefinition, SourceProvider } from '$/sources/$SourceProvider.ts'
import VoltaireJsonRpcSource from '$/sources/Voltaire/JsonRpc/index.ts'

export default {
	provider: SourceProvider.Voltaire,
	label: 'Voltaire',
	sources: [
		VoltaireJsonRpcSource,
	],
} satisfies SourceProviderDefinition
