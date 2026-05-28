import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'

export default {
	provider: SourceProvider.Esplora,
	source: Source.Esplora_Rest,
	label: 'Esplora REST',
} as const
