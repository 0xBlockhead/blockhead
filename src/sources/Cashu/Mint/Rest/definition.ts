import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Cashu,
	source: Source.CashuMint_Rest,
	label: 'Cashu mint REST',
} as const
