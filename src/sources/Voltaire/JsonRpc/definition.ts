import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$sources.ts'

const VoltaireJsonRpcSource = {
	provider: SourceProvider.Voltaire,
	source: Source.Voltaire_JsonRpc,
	label: 'Voltaire JsonRpc',
} satisfies SourceDefinition

export default VoltaireJsonRpcSource
