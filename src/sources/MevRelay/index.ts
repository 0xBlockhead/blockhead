// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/MevRelay/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.MevRelay,
	label: 'MEV-Boost relay',
	sources: [
		{
			source: Source.MevRelay_Rest,
			label: 'MEV-Boost relay REST',
		},
	],
	bindings: bindings[Source.MevRelay_Rest],
} satisfies SourceProviderDefinition
