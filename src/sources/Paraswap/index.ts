import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { paraswapBindings } from '$/sources/Paraswap/bindings.ts'

export default {
	provider: SourceProvider.Paraswap,
	label: 'ParaSwap',
	sources: [
		{
			provider: SourceProvider.Paraswap,
			source: Source.Paraswap_Rest,
			label: 'ParaSwap REST',
		},
	],
	bindings: paraswapBindings,
} satisfies SourceProviderDefinition
