import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'

export default {
	provider: SourceProvider.Payjoin,
	source: Source.PayjoinDirectory_Rest,
	label: 'Payjoin directory REST',
} as const
