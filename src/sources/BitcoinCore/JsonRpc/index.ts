import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.BitcoinCore,
	source: Source.BitcoinCore_JsonRpc,
	label: 'Bitcoin Core JSON-RPC',
} as const
