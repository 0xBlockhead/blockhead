// Generated from APP.ts.

import bindings from '$/sources/Ipfs/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Ipfs,
	label: 'IPFS',
	sources: [
		{
			source: Source.Ipfs_Rest,
			label: 'IPFS Gateway',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
