import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'

export default {
	provider: SourceProvider.Subscan,
	source: Source.Subscan_Rest,
	label: 'Subscan REST',
} as const
