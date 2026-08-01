// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Youtube/bindings.ts'

export default {
	provider: SourceProvider.Youtube,
	label: 'YouTube',
	sources: [
		{
			source: Source.Youtube_Rest,
			label: 'YouTube Data API v3',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
