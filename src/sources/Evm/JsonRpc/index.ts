import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

const EvmJsonRpcSource = {
	provider: SourceProvider.Evm,
	source: Source.Evm_JsonRpc,
	label: 'Evm JsonRpc',
} satisfies SourceDefinition

export default EvmJsonRpcSource
