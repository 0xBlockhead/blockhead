// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Etherscan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Etherscan,
	label: 'Etherscan',
	sources: [
		{
			source: Source.Etherscan_Rest,
			label: 'Etherscan REST',
		},
	],
	bindings: [bindings[Source.Etherscan_Rest]],
} satisfies SourceProviderDefinition
