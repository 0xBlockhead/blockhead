// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/WakuNode/bindings.ts'

export default {
	provider: SourceProvider.WakuNode,
	label: 'Waku node',
	sources: [
		{
			source: Source.WakuNode,
			label: 'Waku node',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
