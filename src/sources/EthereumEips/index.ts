import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { ethereumEipsBindings } from '$/sources/EthereumEips/bindings.ts'

export default {
	provider: SourceProvider.EthereumEips,
	label: 'Ethereum EIPs',
	sources: [
		{
			provider: SourceProvider.EthereumEips,
			source: Source.EthereumEips_Github,
			label: 'Ethereum EIPs GitHub',
		},
	],
	bindings: ethereumEipsBindings,
} satisfies SourceProviderDefinition
