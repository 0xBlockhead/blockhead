import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { oneInchSwapBindings } from '$/sources/OneInchSwap/bindings.ts'

export default {
	provider: SourceProvider.OneInchSwap,
	label: '1inch Swap',
	sources: [
		{
			provider: SourceProvider.OneInchSwap,
			source: Source.OneInchSwap_Rest,
			label: '1inch Swap REST',
		},
	],
	bindings: oneInchSwapBindings,
} satisfies SourceProviderDefinition
