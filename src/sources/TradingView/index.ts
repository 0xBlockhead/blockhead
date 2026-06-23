import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { tradingViewBindings } from '$/sources/TradingView/bindings.ts'

export const tradingViewOrigins = [
	...new Map(
		tradingViewBindings
			.flatMap((binding) => binding.endpoints)
			.map((endpoint) => [
				endpoint.origin,
				{
					origin: endpoint.origin,
					corsEnabled: endpoint.corsEnabled,
				},
			])
	).values(),
]

export default {
	provider: SourceProvider.TradingView,
	label: 'TradingView',
	sources: [
		{
			provider: SourceProvider.TradingView,
			source: Source.TradingView_Rest,
			label: 'TradingView REST',
		},
	],
	bindings: tradingViewBindings,
} satisfies SourceProviderDefinition
