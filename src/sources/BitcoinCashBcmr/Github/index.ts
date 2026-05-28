import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'

export default {
	provider: SourceProvider.BitcoinCashBcmr,
	source: Source.BitcoinCashBcmr_Github,
	label: 'BCMR GitHub',
} as const
