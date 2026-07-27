// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Across/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Across,
	label: 'Across',
	sources: [
		{
			source: Source.Across_Rest,
			label: 'Across REST',
		},
	],
	bindings: [bindings[Source.Across_Rest]],
} satisfies SourceProviderDefinition
