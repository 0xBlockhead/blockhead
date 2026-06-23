import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { binanceChainApiBindings } from '$/sources/BinanceChainApi/bindings.ts'

export default {
	provider: SourceProvider.BinanceChainApi,
	label: 'Binance Chain API',
	sources: [
		{
			provider: SourceProvider.BinanceChainApi,
			source: Source.BinanceChainApi_Rest,
			label: 'Binance Chain API REST',
		},
	],
	bindings: binanceChainApiBindings,
} satisfies SourceProviderDefinition
