import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { zeroExSwapBindings } from '$/sources/ZeroExSwap/bindings.ts'

export default {
	provider: SourceProvider.ZeroExSwap,
	label: '0x Swap',
	sources: [
		{
			provider: SourceProvider.ZeroExSwap,
			source: Source.ZeroExSwap_Rest,
			label: '0x Swap REST',
		},
	],
	bindings: zeroExSwapBindings,
} satisfies SourceProviderDefinition
