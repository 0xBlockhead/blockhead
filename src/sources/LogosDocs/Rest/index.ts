import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'

export default {
	provider: SourceProvider.LogosDocs,
	source: Source.LogosDocs_Rest,
	label: 'Logos docs',
} as const
