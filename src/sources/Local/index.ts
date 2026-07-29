// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Local/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Local,
	label: 'Local',
	sources: [
		{
			source: Source.Local_Internal,
			label: 'Local Internal',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
