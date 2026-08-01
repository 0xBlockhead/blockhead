// Generated from APP.ts.

import bindings from '$/sources/MevRelay/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.MevRelay,
	label: 'MEV-Boost relay',
	sources: [
		{
			source: Source.MevRelay_Rest,
			label: 'MEV-Boost relay REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
