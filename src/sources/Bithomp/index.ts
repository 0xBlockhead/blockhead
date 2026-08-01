// Generated from APP.ts.

import bindings from '$/sources/Bithomp/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Bithomp,
	label: 'Bithomp',
	sources: [
		{
			source: Source.Bithomp,
			label: 'Bithomp',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
