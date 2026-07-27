// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
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
	bindings: [bindings[Source.TradingView_Rest]],
} satisfies SourceProviderDefinition
