import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/SourceProvider.ts'
import { origin } from '$/sources/TradingView/Rest/constants.ts'
import TradingViewRestSource from '$/sources/TradingView/Rest/index.ts'

export default {
	provider: SourceProvider.TradingView,
	label: 'TradingView',
	origins: [
		{
			origin,
			corsEnabled: false,
		},
	],
	sources: [
		TradingViewRestSource,
	],
} satisfies SourceProviderDefinition
