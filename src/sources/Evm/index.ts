
import { type SourceProviderDefinition, SourceProvider } from '$/sources/$SourceProvider.ts'
import EvmJsonRpcSource from '$/sources/Evm/JsonRpc/index.ts'

export default {
	provider: SourceProvider.Evm,
	label: 'Evm',
	sources: [
		EvmJsonRpcSource,
	],
} satisfies SourceProviderDefinition
