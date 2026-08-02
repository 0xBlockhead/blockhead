// Generated from APP.ts.

import bindings from '$/sources/RadicleNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.RadicleNode,
	label: 'Radicle node',
	sources: [
		{
			source: Source.RadicleNode_Control,
			label: 'Radicle node control API',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
