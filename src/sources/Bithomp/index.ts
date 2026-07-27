// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Bithomp/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Bithomp,
	label: 'Bithomp',
	sources: [
		{
			source: Source.Bithomp_Rest,
			label: 'Bithomp REST',
		},
	],
	bindings: [bindings[Source.Bithomp_Rest]],
} satisfies SourceProviderDefinition
