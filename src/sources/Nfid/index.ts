// Generated from APP.ts.

import bindings from '$/sources/Nfid/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Nfid,
	label: 'NFID',
	sources: [
		{
			source: Source.Nfid_WalletApi,
			label: 'NFID wallet API',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
