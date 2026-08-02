// Generated from APP.ts.

import bindings from '$/sources/AvalancheInfo/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.AvalancheInfo,
	label: 'Avalanche Info API',
	sources: [
		{
			source: Source.AvalancheInfo_JsonRpc,
			label: 'Avalanche Info JSON-RPC',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
