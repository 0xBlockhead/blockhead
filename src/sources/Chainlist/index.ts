// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Chainlist/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Chainlist,
	label: 'Chainlist',
	sources: [
		{
			source: Source.Chainlist_Rest,
			label: 'Chainlist REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
