import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Filfox,
	source: Source.Filfox_Rest,
	label: 'Filfox REST',
} as const
