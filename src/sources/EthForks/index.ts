import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { ethForksBindings } from '$/sources/EthForks/bindings.ts'

export default {
	provider: SourceProvider.EthForks,
	label: 'EthForks',
	sources: [
		{
			provider: SourceProvider.EthForks,
			source: Source.EthForks_Rest,
			label: 'EthForks REST',
		},
	],
	bindings: ethForksBindings,
} satisfies SourceProviderDefinition
