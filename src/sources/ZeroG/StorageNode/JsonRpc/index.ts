import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'

export default {
	provider: SourceProvider.ZeroG,
	source: Source.ZeroGStorageNode_JsonRpc,
	label: '0G Storage node JSON-RPC',
} as const
