import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { binanceChainExplorerBindings } from '$/sources/BinanceChainExplorer/bindings.ts'

export default {
	provider: SourceProvider.BinanceChainExplorer,
	label: 'Binance Chain Explorer',
	sources: [
		{
			provider: SourceProvider.BinanceChainExplorer,
			source: Source.BinanceChainExplorer_Rest,
			label: 'Binance Chain Explorer REST',
		},
	],
	bindings: binanceChainExplorerBindings,
} satisfies SourceProviderDefinition
