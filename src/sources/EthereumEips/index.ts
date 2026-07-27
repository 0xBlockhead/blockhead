// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/EthereumEips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.EthereumEips,
	label: 'Ethereum EIPs',
	sources: [
		{
			source: Source.EthereumEips_Github,
			label: 'Ethereum EIPs GitHub',
		},
	],
	bindings: bindings[Source.EthereumEips_Github],
} satisfies SourceProviderDefinition
