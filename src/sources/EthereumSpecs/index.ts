import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { ethereumSpecsBindings } from '$/sources/EthereumSpecs/bindings.ts'

export default {
	provider: SourceProvider.EthereumSpecs,
	label: 'Ethereum specs',
	sources: [
		{
			provider: SourceProvider.EthereumSpecs,
			source: Source.EthereumSpecs_Github,
			label: 'Ethereum specs GitHub',
		},
	],
	bindings: ethereumSpecsBindings,
} satisfies SourceProviderDefinition
