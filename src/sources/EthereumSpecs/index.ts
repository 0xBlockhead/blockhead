// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/EthereumSpecs/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.EthereumSpecs,
	label: 'Ethereum specs',
	sources: [
		{
			source: Source.EthereumSpecs_Github,
			label: 'Ethereum specs GitHub',
		},
	],
	bindings: bindings[Source.EthereumSpecs_Github],
} satisfies SourceProviderDefinition
