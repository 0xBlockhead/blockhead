// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Nodely/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Nodely,
	label: 'Nodely',
	sources: [
		{
			source: Source.Nodely,
			label: 'Nodely',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
