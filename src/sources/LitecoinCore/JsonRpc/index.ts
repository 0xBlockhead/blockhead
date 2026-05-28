import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'

export default {
	provider: SourceProvider.LitecoinCore,
	source: Source.LitecoinCore_JsonRpc,
	label: 'Litecoin Core JSON-RPC',
} as const
