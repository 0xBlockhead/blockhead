import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.ZeroG,
	source: Source.ZeroGChainScan_Rest,
	label: '0G ChainScan REST',
} as const
