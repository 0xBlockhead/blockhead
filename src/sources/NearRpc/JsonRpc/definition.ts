import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.NearRpc,
	source: Source.NearRpc_JsonRpc,
	label: 'NEAR JSON-RPC',
} as const
