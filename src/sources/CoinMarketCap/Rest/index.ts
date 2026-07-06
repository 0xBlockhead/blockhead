// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const coinMarketCapRestSourceDefinition = {
	provider: SourceProvider.CoinMarketCap,
	source: Source.CoinMarketCap_Rest,
	label: 'CoinMarketCap REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default coinMarketCapRestSourceDefinition
