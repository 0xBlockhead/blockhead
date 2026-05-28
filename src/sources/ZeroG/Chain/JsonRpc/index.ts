import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'

export default {
	provider: SourceProvider.ZeroG,
	source: Source.ZeroGChain_JsonRpc,
	label: '0G Chain JSON-RPC',
} as const
