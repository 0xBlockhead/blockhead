import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.CometBft,
	source: Source.CometBft_Rest,
	label: 'CometBFT REST',
} as const
