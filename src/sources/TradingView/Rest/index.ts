import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/index.ts'

const TradingViewRestSource = {
	provider: SourceProvider.TradingView,
	source: Source.TradingView_Rest,
	label: 'TradingView Rest',
} satisfies SourceDefinition

export default TradingViewRestSource
