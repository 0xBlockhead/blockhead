// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/TronGrid/bindings.ts'

export default {
	provider: SourceProvider.TronGrid,
	label: 'TronGrid',
	sources: [
		{
			source: Source.TronGrid_Rest,
			label: 'TronGrid REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
