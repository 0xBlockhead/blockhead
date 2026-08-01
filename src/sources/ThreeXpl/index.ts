// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/ThreeXpl/bindings.ts'

export default {
	provider: SourceProvider.ThreeXpl,
	label: '3xpl',
	sources: [
		{
			source: Source.ThreeXpl_Rest,
			label: '3xpl REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
