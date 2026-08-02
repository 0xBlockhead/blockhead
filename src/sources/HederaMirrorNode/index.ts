// Generated from APP.ts.

import bindings from '$/sources/HederaMirrorNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.HederaMirrorNode,
	label: 'Hedera mirror node',
	sources: [
		{
			source: Source.HederaMirrorNode_Rest,
			label: 'Hedera mirror node REST',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
