import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'

export default {
	provider: SourceProvider.MoneroDaemonRpc,
	source: Source.MoneroDaemonRpc_JsonRpc,
	label: 'monerod JSON-RPC',
} as const
