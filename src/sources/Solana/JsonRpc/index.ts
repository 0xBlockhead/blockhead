import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'

export default {
	provider: SourceProvider.Solana,
	source: Source.Solana_JsonRpc,
	label: 'Solana JSON-RPC',
} as const
