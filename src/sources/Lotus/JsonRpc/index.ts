import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'

export default {
	provider: SourceProvider.Lotus,
	source: Source.Lotus_JsonRpc,
	label: 'Lotus JSON-RPC',
} as const
