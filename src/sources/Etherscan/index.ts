// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Etherscan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Etherscan,
	label: 'Etherscan',
	sources: [
		{
			source: Source.Etherscan_Rest,
			label: 'Etherscan REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
