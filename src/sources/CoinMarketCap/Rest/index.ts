import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

const CoinMarketCapRestSource = {
	provider: SourceProvider.CoinMarketCap,
	source: Source.CoinMarketCap_Rest,
	label: 'Coin Market Cap Rest',
} satisfies SourceDefinition

export default CoinMarketCapRestSource
