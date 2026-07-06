// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const binanceChainApiRestSourceDefinition = {
	provider: SourceProvider.BinanceChainApi,
	source: Source.BinanceChainApi_Rest,
	label: 'Binance Chain API REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default binanceChainApiRestSourceDefinition
