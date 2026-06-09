import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Hyperliquid,
	source: Source.Hyperliquid_JsonRpc,
	label: 'HyperEVM JSON-RPC',
} as const
