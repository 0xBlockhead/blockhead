// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Chainlist/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Chainlist,
	label: 'Chainlist',
	sources: [
		{
			source: Source.Chainlist_Rest,
			label: 'Chainlist REST',
		},
	],
	bindings: [bindings[Source.Chainlist_Rest]],
} satisfies SourceProviderDefinition
