// Generated from APP.ts.

import bindings from '$/sources/EthereumLists/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.EthereumLists,
	label: 'ethereum-lists (chainid.network)',
	sources: [
		{
			source: Source.EthereumLists_Rest,
			label: 'ethereum-lists REST',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
