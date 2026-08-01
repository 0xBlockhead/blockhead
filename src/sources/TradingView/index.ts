// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/TradingView/bindings.ts'

export default {
	provider: SourceProvider.TradingView,
	label: 'TradingView',
	sources: [
		{
			source: Source.TradingView_Rest,
			label: 'TradingView REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
