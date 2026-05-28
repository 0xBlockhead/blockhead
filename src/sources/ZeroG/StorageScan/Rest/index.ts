import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'

export default {
	provider: SourceProvider.ZeroG,
	source: Source.ZeroGStorageScan_Rest,
	label: '0G StorageScan REST',
} as const
