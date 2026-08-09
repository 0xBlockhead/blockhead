import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/TradingView/bindings.ts'

export default {
	provider: SourceProvider.TradingView,
	label: 'TradingView',
	sources: {
		[Source.TradingView_Rest]: {
			label: 'TradingView REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
