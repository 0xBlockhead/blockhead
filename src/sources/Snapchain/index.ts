// Generated from APP.ts.

import bindings from '$/sources/Snapchain/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Snapchain,
	label: 'Snapchain',
	sources: [
		{
			source: Source.Snapchain_Rest,
			label: 'Snapchain REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
