// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/Xaman/bindings.ts'

export default {
	provider: SourceProvider.Xaman,
	label: 'Xaman',
	sources: [
		{
			source: Source.Xaman_Api,
			label: 'Xaman API',
		},
	],
	bindings: [bindings[Source.Xaman_Api]],
} satisfies SourceProviderDefinition
