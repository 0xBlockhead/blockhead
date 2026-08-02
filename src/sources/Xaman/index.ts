// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
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
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
